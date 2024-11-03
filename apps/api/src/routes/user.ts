import express, {Response, Request } from "express"
import { UserSignin, UserSignup } from "../middleware/Zodvalidation";
import { ZodError } from "zod";
import client from "..";
const router=express.Router();
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import authMiddleware from "../middleware/authMiddleware";
import { Prisma } from "@repo/prisma/src";
dotenv.config();

export default router


//create user
router.post("/signup",async (req:Request,res:Response)=>{
    const data=req.body;
    try{
        await UserSignup.parseAsync(data);
        //check  if user is already present
        let user=await client.user.findUnique({
            where:{
                username:data.username
            }
        })
        if(user){
            res.status(400).json({
                message:"user already exists"
            })
            return
        }

        //create user
         user=await client.user.create({
            data:{
                username:data.username,
                password:data.password,
                role:data.role,
                avatar: data.avatar?data.avatar:""
            }
        })
        const secretKey = process.env.SECRETKEY;
        if (!secretKey) {
            throw new Error('SECRETKEY is not defined');
        }
        const userId=user.id
        const token =jwt.sign({userId},secretKey);
         res.json({
            message:"user created",
            token
        })
        return
        

    }catch(err){
        if(err  instanceof ZodError ){
            console.log(err);
            res.status(404)
            return
        }else{
            console.log(err);
            res.status(404)
            return
        }
    }
})


//singin post
router.post("signin",async(req:Request,res:Response)=>{
    const body=req.body;
    try{
        await UserSignin.parseAsync(body)
        
        const user=await client.user.findUnique({
            where:{
                username:body.username,
                password:body.password
            }
        })

        if(!user){
            res.status(403).json({
                message:"something went wrong"
            })
            return
        }
        const userId=user.id
        const secretKey=process.env.SECRETKEY;
        if(!secretKey){
            throw new Error("Secret key is not defined")
        }
        const token =jwt.sign({userId},secretKey);
        res.status(300).json({
            message:"user logged in successdully",
            token
        })
        return

    }catch(err){
        if(err instanceof ZodError){
            console.log(err);
            res.status(403)
            return
        }else{
            console.log(err);
            res.status(403);
            return
        }
    }
})

//update MetaData --> avatar
router.post("/user/metadata",authMiddleware, async(req:Request,res:Response)=>{
    const userId=res.locals.userId
    const {avatarId}=req.body
    try{
       const avatar= await client.avatar.findUnique({
            where:{
                id:avatarId
            }
        })
        if(!avatar){
             res.status(404).json({
                message:"avatar not found"
            })
            return
        }
        

        await client.user.update({
            where:{
                id:userId
            },
            data:{
                avatarId:avatarId
            }

        })
        res.status(200).json({
            message:"Meta data added"
        })
        return

    }catch(err){
        res.status(400).json({
            message:err
        })
        return
    } 
})

//get all avatars
router.get("/avatars",async (req:Request,res:Response)=>{
    const avatars=await client.avatar.findMany({});
    res.json({
        avatars
    })
    return;
})

//bulk is left
// router.get("/user/metadata/bulk?ids=[1,3,55]",authMiddleware,(req:Request,res:Response)=>{

// })

//get your metadata
router.get("/metadata",authMiddleware, async(req:Request,res:Response)=>{
    const userId=res.locals.userId
    try{
        const user=await client.user.findUnique({
            where:{
                id:userId
            }
        })

        res.json({
            metadata:user?.avatarId
        })
        return
    }catch(err){
        res.status(404).json({
            message:err
        })
        return
    }   
})



