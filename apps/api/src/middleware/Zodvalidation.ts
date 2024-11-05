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

//create a element
export const CreateElement=z.object({
    width:z.number({required_error:"width required"}),
    height:z.number({required_error:"height required"}),
    imageUrl:z.string({required_error:"url is required"})
    .url({message:"please give a valid url"}),
    static:z.boolean({required_error:"please give static type of the element"})
    
})

//update element
export const updateElememt=z.object({
    imageUrl:z.string({
    required_error:"image is required"
    }).url({message:"give a valid url"})
})

//create avatar
export const createAvatar=z.object({
    imageUrl:z.string({
        required_error:"image is required"
    }).url({message:"give a valid url"}),
    name:z.string({required_error:"give a valid url"})
})

//create map
export const CreateMap=z.object({
    thumbnail:z.string({required_error:"thumnail is rquire"})
    .url({message:"url is rquired"}),
    name:z.string({required_error:"name is required"}),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number(),
    }))
})

//add a element in the space
export const addElement=z.object({
    elementId:z.string(),
    spaceId:z.string(),
    x:z.number(),
    y:z.number()
})