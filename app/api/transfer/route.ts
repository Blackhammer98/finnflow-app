import { auth } from "@/app/lib/auth";
import prisma from "@/db/src/prisma";
import { NextResponse } from "next/server";



export async function POST(request : Request) {
    
    const  session =  await auth();

    if(!session?.user?.id)  {
        return NextResponse.json({error : 'Unauthorized'},{status:401})
    }

    try {
        const body = await request.json();
        const {recipientId ,amount} = body;
        const senderId = session.user.id;

        if(!recipientId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return NextResponse.json({error : 'Invalid RecipientId or amount'} ,{ status : 400})
        }


        const amountToTransfer = parseFloat(amount);
        const senderIdInt = parseInt(senderId);
        const recipientIdInt = parseInt(recipientId);

        const transferResult = await prisma.$transaction(async (tx) => {
            const sender = await tx.user.findUnique({where : {id : senderIdInt}});
            const recipient = await tx.user.findUnique({where : {id: recipientIdInt}});

            if(!sender || !recipient)  {
               throw new Error ('Sender or Recipient not found')
            };

            const senderBalance  = await tx.balance.findUnique({where : {userId : senderIdInt}});

            if(!senderBalance || senderBalance.amount < amountToTransfer) {
                throw new Error ("Insufficient balance");
            }

            const updatedSenderBalance = await tx.balance.update({
                where : {userId : senderIdInt},
                data : {
                    amount : {decrement : amountToTransfer}
                },
            });

            const updatedRecipientBalance = await tx.balance.update({
                where : {userId : recipientIdInt},
                data : {amount : {increment : amountToTransfer}}
            });

            const transaction = await tx.transaction.create({
                data : {
                    senderId : senderIdInt,
                    receiverId : recipientIdInt,
                    amount : amountToTransfer,
                    type :'Transfer',
                    status : "Completed"
                },
            });

            return { success : true , transactionId : transaction.id}

        });

        return NextResponse.json(
            {message : 'Transfer succesful' , transactionId  : transferResult.transactionId},
        {status : 200}
    );
    } catch (error:any) {
        console.error('Error processing transfer : ' ,error);
        return NextResponse.json({error:error.message || 'Internal server error'},{status : 411})
    }
}