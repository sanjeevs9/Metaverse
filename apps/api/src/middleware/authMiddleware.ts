import jwt,{JwtPayload} from "jsonwebtoken"
import { NextFunction, Request,Response } from "express"
import dotenv from  "dotenv"
dotenv.config()

interface CustomJwtPayload extends JwtPayload {
    userId: string;
}

export default async function authMiddleware(req:Request,res:Response,next:NextFunction){
    let token=req.headers.authorization;
    
    if(!token || !token.startsWith("Bearer")){
        res.status(403).json({
            message:"user not found"
        })
        return
    }
    token=token.split(" ")[1];

    const secretKey=process.env.SECRETKEY
    if(!secretKey){
        throw new Error("secret key not found")
    }
    const decode=jwt.verify(token,secretKey) as CustomJwtPayload

    if(!decode){
        res.status(403).json({
            message:"user not found"
        })
        return
    }
    res.locals.userid=decode.userId
    next()
}