import express, {Response, Request } from "express"
import { UserSignin, UserSignup } from "../middleware/Zodvalidation";
import { ZodError } from "zod";
import client from "..";
const router=express.Router();
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
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
        const id=user.id
        const secretKey=process.env.SECRETKEY;
        if(!secretKey){
            throw new Error("Secret key is not defined")
        }
        const token =jwt.sign({id},secretKey);
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