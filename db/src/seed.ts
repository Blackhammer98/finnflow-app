import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'


const prisma  = new PrismaClient();

async function seed() {
    const suhani = await prisma.user.create({
        data: {
          email: 'suhani@example.com',
          name: 'suhani',
          password: await bcrypt.hash('password123', 10),
          Balance: {
            create: {
              amount: 20000,
              locked: 0,
            },
          },
          OnRampTransaction:{
            create : {
               
                status: 'Success',
                token: 'ONRAMP005',
                provider: 'HDFC Bank',
                amount: 200,
                startTime: new Date(),  
          }
        },
      }
});

console.log("Created user :" ,suhani);

const chahat = await prisma.user.create({
    data: {
      email: 'chahat@example.com',
      name: 'deb',
      password: await bcrypt.hash('password123', 10),
      Balance: {
        create: {
          amount: 50000,
          locked: 0,
        },
      },
      OnRampTransaction:{
        create : {
           
            status: 'Success',
            token: 'ONRAMP004',
            provider: 'HDFC Bank',
            amount: 500,
            startTime: new Date(),  
      }
    },
  }
});
console.log("Created user :" ,chahat);
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });