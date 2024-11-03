import {z} from "zod"

export const UserSignup=z.object({
    username:z.string({required_error:"username cant be empty"})
    .min(3,{message:"atleast of 3 letter"}),
    password:z.string({required_error:"password cannot be empty"})
    .min(3,{message:"atleast of 3 digit"}),
    role:z.enum(["Admin","User"])
})

export const UserSignin=z.object({ 
    username:z.string({required_error:"username cant be empty"})
    .min(3,{message:"atleast of 3 letter"}),
    password:z.string({required_error:"password cannot be empty"})
    .min(3,{message:"atleast of 3 digit"}),
})

export const CreateSpace=z.object({
    name:z.string({required_error:"name of the space is required"})
    .min(3,{message:"atleast 3 letter room name please"}),
    mapId:z.string().optional()
})