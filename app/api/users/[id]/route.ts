// app/api/users/[id]/route.ts
import { auth } from "@/app/lib/auth";
import prisma from "@/db/src/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
  { params }: { params: { id: string } }
) {

    console.log("API route called with ID:", params.id);
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    console.log("Unauthorized: No user session");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = parseInt(params.id);
    console.log("Parsed user ID:", userId);
    
    if (isNaN(userId)) {
        console.log("Invalid user ID (NaN)");
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Don't allow fetching own user details for transfer
    if (userId === parseInt(session.user.id)) {
        console.log("User tried to transfer to self");
      return NextResponse.json(
        { error: "Cannot transfer to yourself" }, 
        { status: 400 }
      );
    }
    console.log("Searching for user with ID:", userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        // Don't include sensitive fields like password
      },
    });
    console.log("Database response:", user);
    if (!user) {
        console.log("No user found with ID:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}