import {z} from "zod"

export const userSignupInputs = z.object({
    name : z.string().min(2).max(12),
    email : z.string().email(),
    password : z.string().min(6)
})


export type UserSignupInputs = z.infer<typeof userSignupInputs>;