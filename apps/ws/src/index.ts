import WebSocket from "ws";
import http from "http"
import dotenv from "dotenv"
dotenv.config();
import jwt from "jsonwebtoken";
import { Rooms ,clientJoin ,CustomJwtPayload,clientMove } from "./types";
import { onJoin } from "./client";

const server=http.createServer()
const ws=new WebSocket.Server({server});

export const room:Rooms ={}
export const userData= new Map<WebSocket,{userId:string,spaceId:string}>();

ws.on("connection",async (socket:WebSocket)=>{     
    socket.on("message",(data:string)=>{
        const message=JSON.parse(data) as clientMove | clientJoin;
        if(message.type=="join"){
            const spaceId=message.payload.spaceId;
            const token = message.payload.token;

            if(!process.env.SECRET){
                return;
            }
            const decoded=jwt.verify(token,process.env.SECRET) as CustomJwtPayload
            if(!decoded){
                //cannot verify
                socket.close(400,JSON.stringify({message:"user not defined"}))
                return;
            }
            const userId:string=decoded.userId!;
        
            if(!room[spaceId]){
                room[spaceId]=new Map()
            }
            const x=Math.floor(Math.random()*10);
            const y=Math.floor(Math.random()*10);

            //add user Data
            userData.set(socket,{userId,spaceId})

            //add user in the room
            room[spaceId].set(userId,{webSocket:socket,payload:{x,y}});

            //send each user my data and also get each user their data
            onJoin(socket,userId,spaceId,x,y)
            
        }else if(message.type=="move"){
            if(!userData.has(socket)){
                return  
            }

            //check if move is valid
            
            const x=message.payload.x;
            const y=message.payload.y;

            const userValue=userData.get(socket);
            if(!userValue){
                return;
            }
            const userId=userValue.userId;
            const spaceId=userValue.spaceId;
            Array.from(room[spaceId].values()).map((value)=>{
                if(value.webSocket!==socket && value.webSocket.onopen){
                    value.webSocket.send(JSON.stringify({
                        "type":"movement",
                        "payload":{
                            x,
                            y,
                            "userId":userId
                        }
                    }))
                }
            })
        }
    })
    socket.on("error",()=>{
        socket.emit(JSON.stringify({message:"something went wrong"}))
    })

    //close logic
    socket.on("close",()=>{
        const spaceId:string=userData.get(socket)?.spaceId || ""
        if(room[spaceId]){
            const values=Array.from(room[spaceId].entries());
            values.forEach((value)=>{
                if(value[1].webSocket!==socket && value[1].webSocket.onopen){
                    value[1].webSocket.send(JSON.stringify({
                        "type":"user-left",
                            "payload":{
                                "userId":userData.get(socket)?.userId   
                            }    
                    }))
                }
            })
            
        }   
        socket.send(JSON.stringify({message:"socket disconnect"}))
    })
})

server.listen(8080,()=>{
    console.log("web socket connected");
    
})