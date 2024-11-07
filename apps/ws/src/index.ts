import WebSocket from "ws";
import http from "http"
import dotenv from "dotenv"
dotenv.config();
import jwt from "jsonwebtoken";
import { Room ,clientJoin ,CustomJwtPayload,clientMove } from "./types";

const server=http.createServer()
const ws=new WebSocket.Server({server});

const room:Room={}
const userData= new Map<WebSocket,{userId:string,spaceId:string}>();

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
            const userId=decoded.userId!;
            userData.set(socket,{userId,spaceId})
            if(!room[spaceId]){
                room[spaceId]=[]
            }
            room[spaceId].push(socket);
        }else if(message.type=="move"){
            //checks if the socket(user) is in the WS
            if(!userData.has(socket)){
                return  
            }

            const spaceId:string=userData.get(socket)?.spaceId || "";
               if(room[spaceId]){
                    room[spaceId].forEach((client)=>{
                        if(client!=socket && client.onopen){
                            client.emit(JSON.stringify({
                                "type":"movement",
                                "payload":{
                                    "x":message.payload.x,
                                    "y":message.payload.y,
                                    "userId":userData.get(socket)?.userId
                                }
                            }))
                        }
                    })
               }
        }
    })
    socket.on("error",()=>{
        socket.emit(JSON.stringify({message:"something went wrong"}))
    })
    socket.on("close",()=>{
        const spaceId:string=userData.get(socket)?.spaceId || ""
        if(room[spaceId]){
            room[spaceId].forEach((client)=>{
                if(client.onopen && client!==socket){{
                    client.emit(JSON.stringify({
                        "type":"user-left",
                        "payload":{
                            "userId":userData.get(socket)?.userId
                        }
                    }))
                }}
            })
        }   
        socket.emit(JSON.stringify({message:"socket disconnect"}))
    })
})

server.listen(8080,()=>{
    console.log("web socket connected");
    
})