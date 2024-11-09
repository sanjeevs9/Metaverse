import { JwtPayload } from "jsonwebtoken"
import WebSocket from "ws"
export type clientMove={
    "type":"move",
    "payload":{
        "x":number,
        "y":number
    }
}

export type clientJoin={
    "type":"join",
    "payload":{
        "spaceId":string,
        "token":string
    }
}


export type Rooms={
    [id:string]:Map<string,{webSocket:WebSocket,payload:{x:number,y:number}}>
}
//roomId:<"userid","websocket,payload:{x:,y:}">


export interface CustomJwtPayload extends JwtPayload {
    userId: string;
}

export type Space_Joined={
    "type":"space-joined",
    "payload":{
        "spawn":{
            "x":number,
            "y":number
        },
        "users":{
            [userId:string]:{
                "payload":{
                    "x":number,
                    "y":number
                }
            }
        }[]
    }
}