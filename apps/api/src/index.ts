import express, { Request, Response } from "express"
import cors from "cors"
import router from "./routes";
import {PrismaClient} from "@repo/prisma/src"

const app=express();
app.use(express.json());
app.use(cors());
const client=new PrismaClient();
export default client;

app.get("/",(req:Request,res:Response)=>{
    res.json({
        message:"hii how are you"
    })
    return
})
app.use("/api/v1",router)


app.listen(3000);