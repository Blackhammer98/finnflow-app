"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        const suhani = yield prisma.user.create({
            data: {
                email: 'suhani@example.com',
                name: 'suhani',
                password: yield bcrypt_1.default.hash('password123', 10),
                Balance: {
                    create: {
                        amount: 20000,
                        locked: 0,
                    },
                },
                OnRampTransaction: {
                    create: {
                        status: 'Success',
                        token: 'ONRAMP005',
                        provider: 'HDFC Bank',
                        amount: 200,
                        startTime: new Date(),
                    }
                },
            }
        });
        console.log("Created user :", suhani);
        const chahat = yield prisma.user.create({
            data: {
                email: 'chahat@example.com',
                name: 'deb',
                password: yield bcrypt_1.default.hash('password123', 10),
                Balance: {
                    create: {
                        amount: 50000,
                        locked: 0,
                    },
                },
                OnRampTransaction: {
                    create: {
                        status: 'Success',
                        token: 'ONRAMP004',
                        provider: 'HDFC Bank',
                        amount: 500,
                        startTime: new Date(),
                    }
                },
            }
        });
        console.log("Created user :", chahat);
    });
}
;
seed()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
