import { auth } from "@/app/lib/auth";
import prisma from "@/db/src/prisma";

import { NextResponse } from "next/server";


export async function GET() {

    const session = await auth();

    if(!session?.user?.id) {
        return NextResponse.json({error : "Unauthorised"},{status:401})
    }
try {
    const userId = parseInt(session.user.id);
    
    const transactions = await prisma.onRampTransaction.findMany({
        where : {userId : userId},

        select : {
            id: true,
            status: true,
            token: true,
            provider: true,
            amount: true,
            startTime: true
        },
    });

    return NextResponse.json({
        transactions : transactions.map(txn => ({
            ...txn , 
            amount  :txn.amount,
        }))
    })
  
} catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
    
}




export async function POST(request : Request) {
    const session = await auth();

    if(!session?.user?.id) {
        return NextResponse.json({error : "Unauthorized"}, {status:401})
    }

    try {
        const body = await request.json();
        const {provider , amount} = body;

        if (!provider || !amount || isNaN(amount)) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const userId = parseInt(session.user.id);
        const amountInPaisa = amount
        const token = (Math.random()*1000).toString();
        const transaction =  await prisma.onRampTransaction.create({
            data : {
                status : "Processing",
                token : token,
                provider,
                amount : amountInPaisa,
                startTime :new Date(),
                userId
            }
        });

        const existingBalance = await prisma.balance.findUnique({
            where: {userId : userId}
        });

        if(existingBalance) {
            await prisma.balance.update({
                where : {userId:userId} , 
                data :{
                    amount : existingBalance.amount + amountInPaisa
                }
            });
        } else {
            await prisma.balance.create({
                data : {
                    userId,
                    amount : amountInPaisa,
                    locked : 0
                }
            });
        }

        const updatedTransaction = await prisma.onRampTransaction.update({
           where : {id : transaction.id},
           data : {status  : "Success"}
        })

        return NextResponse.json({
            transaction:{
                ...updatedTransaction , 
                amount : updatedTransaction.amount/100
            }
        },{status:201});
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}