// app/api/balance/route.ts
import { auth } from "@/app/lib/auth";
import prisma from "@/db/src/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = parseInt(session.user.id);
        const balance = await prisma.balance.findUnique({
            where: { userId: userId },
            select: { amount: true, locked: true },
        });

        if (!balance) {
            return NextResponse.json({ error: 'Balance not found for user.' }, { status: 404 });
        }

        return NextResponse.json({
             totalBalance: balance.amount / 100,
              locked: balance.locked / 100  });
    } catch (error: any) {
        console.error('Error fetching balance:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}