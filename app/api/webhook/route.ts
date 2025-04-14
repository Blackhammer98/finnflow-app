import prisma from "@/db/src/prisma";
import {  NextResponse } from "next/server";


export async function POST(request : Request) {

    try {
        const body  = await request.json();

        console.log('Received webhook data : ' ,body);

        if(body?.type === 'onramp.sucess' && body?.trascationId && body?.userId && body?.amount) {
            const {transactionId , userId , amount} = body;

            const updatedOnRamp = await prisma.onRampTransaction.update({
                where : {token : transactionId} ,
                data : {status : "Success"},
            });

            if(updatedOnRamp) {
                const updatedBalance = await prisma.balance.update({
                    where : {userId : parseInt(userId)},
                    data : {amount : {increment : parseInt(amount)}},
                });

                if(updatedBalance) {
                    return NextResponse.json({message: 'Webhook processed successfully'},{status : 200})
                }else {
                    console.error("Failed to update the suer balance for webhook:",body);
                    return NextResponse.json({error : 'Failed to update user balance'},{status:500})
                }
            } else {
               console.error('Failed to update OnRampTransaction for webhook:', body);
               return NextResponse.json({ErrorEvent : 'Failed to update OnRampTransaction'},{status:500})
            }
        }else if(body?.type === 'onramp.failure' && body?.transactionId) {
             const updatedOnRamp  = await prisma.onRampTransaction.update({
                where : {token :  body.transactionId },
                data : {status : "Failure"}
             });

             return NextResponse.json({ message: 'Webhook processed (failure)' }, { status: 200 });
        }   else if (body?.type) {
            console.log('Received unknown webhook type:', body.type, body);
            return NextResponse.json({ message: 'Webhook received (unknown type)' }, { status: 200 });
          } else {
            console.error('Invalid webhook format:', body);
            return NextResponse.json({ error: 'Invalid webhook format' }, { status: 400 });
          }
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Erro while processinig webHook' }, { status: 411 });
    }
    
}