
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import prisma from "@/db/src/prisma";
import { userSignupInputs, UserSignupInputs } from "@/app/validations/user"; 

export async function POST(request:Request) {
    
    try {

        const body = await request.json();

        const userValdiation = userSignupInputs.safeParse(body);
        if (!userValdiation.success) {
            return NextResponse.json({ error: userValdiation.error.issues }, { status: 400 });
        }
        const { name , email , password} = userValdiation.data as UserSignupInputs;

        if(!name || !email || !password) {
            return NextResponse.json({error : "Missing Required fields (email, name ,password)"} ,
                {status :  400}
             )
        }

        const hashedPassword = await bcrypt.hash(password , 10);

       await prisma.user.create({
            data :{
                name,
                email,
                password : hashedPassword,
            }
        });
        return NextResponse.json({
            message : "User registered suuessfully.",
        },
        {status : 201})
    } catch (error) {
        console .log("Error while registering User!");
    }
}
