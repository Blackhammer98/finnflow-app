import { auth } from "@/app/lib/auth";
import prisma from "@/db/src/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = parseInt(session.user.id);
        
        // Fetch transactions where the user is either sender or receiver
        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ],
                type: 'Transfer'
            },
            include: {
                sender: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                receiver: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Format the data to match what the frontend expects
        const formattedTransactions = transactions.map(tx => ({
            id: tx.id,
            status: tx.status,
            amount: tx.amount / 100, 
            startTime: tx.createdAt.toString(),
            p2pDetails: {
                sender: tx.sender.name || tx.sender.email,
                receiver: tx.receiver.name || tx.receiver.email,
                
            }
        }));

        return NextResponse.json({
            transactions: formattedTransactions
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching transfer history:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to fetch transfer history',
            transactions: [] 
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { recipientId, amount } = body;
        const senderId = session.user.id;

        if (!recipientId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return NextResponse.json({ error: 'Invalid RecipientId or amount' }, { status: 400 });
        }

        const amountToTransfer = parseFloat(amount)*100;
        const senderIdInt = parseInt(senderId);
        const recipientIdInt = parseInt(recipientId);

        const transferResult = await prisma.$transaction(async (tx) => {
            const sender = await tx.user.findUnique({ where: { id: senderIdInt } });
            const recipient = await tx.user.findUnique({ where: { id: recipientIdInt } });

            if (!sender || !recipient) {
                throw new Error('Sender or Recipient not found');
            };

            const senderBalance = await tx.balance.findUnique({ where: { userId: senderIdInt } });

            if (!senderBalance || senderBalance.amount < amountToTransfer) {
                throw new Error("Insufficient balance");
            }

            const updatedSenderBalance = await tx.balance.update({
                where: { userId: senderIdInt },
                data: {
                    amount: { decrement: amountToTransfer }
                },
            });

            if (!updatedSenderBalance) {
                throw new Error('Failed to update sender balance during transfer.');
            }

            // Check if recipient has a balance record
            const recipientBalance = await tx.balance.findUnique({ 
                where: { userId: recipientIdInt } 
            });

            let updatedRecipientBalance;
            
            if (recipientBalance) {
                // Update existing balance
                updatedRecipientBalance = await tx.balance.update({
                    where: { userId: recipientIdInt },
                    data: { amount: { increment: amountToTransfer } }
                });
            } else {
                // Create new balance record for recipient
                updatedRecipientBalance = await tx.balance.create({
                    data: {
                        userId: recipientIdInt,
                        amount: amountToTransfer,
                        locked: 0
                    }
                });
            }

            if (!updatedRecipientBalance) {
                throw new Error('Failed to update recipient balance during transfer.');
            }

            const transaction = await tx.transaction.create({
                data: {
                    senderId: senderIdInt,
                    receiverId: recipientIdInt,
                    amount: amountToTransfer,
                    type: 'Transfer',
                    status: "Completed"
                },
            });

            return { success: true, transactionId: transaction.id };
        });

        return NextResponse.json(
            { message: 'Transfer succesful', transactionId: transferResult.transactionId },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error processing transfer: ', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 411 });
    }
}