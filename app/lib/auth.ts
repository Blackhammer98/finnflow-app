import prisma from "@/db/src/prisma";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt"


interface User {
    id: string; 
    name?: string | null;
    email?: string | null;}


export const { handlers , signIn , signOut , auth } = NextAuth({
    providers:[
        Credentials({
            name: 'Credentials',
            async authorize(credentials) {
              const { email, password } = credentials as Record<string, string>;
      
              if (!email || !password) {
                return null;
              }
      
              const userFromDb = await prisma.user.findFirst({ where: { email } });
      
              if (!userFromDb) {
                return null;
              }
      
              const passwordMatch = await bcrypt.compare(password, userFromDb.password);
      
              if (passwordMatch) {
                const user : User = {
                    id: userFromDb.id.toString(),
                    name : userFromDb.name,
                    email : userFromDb.email
                };
                return user;
              } else {
                return null;
              }
            },
          }),
        
    ],

    secret: process.env.NEXTAUTH_SECRET,
    session :  {
        strategy: 'jwt',
    },

    callbacks : {
        jwt : async({token , user}) => {
            if(user) {
                token.id = user.id;
            }
            return token;
        },
        session: async({session,token}) => {
            if(token?.id) {
                session.user.id = token.id as string;
            }
            return session
        },

    },

    pages : { 
        signIn : '/login'
    },

});