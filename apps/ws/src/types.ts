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

export type Room={
    [id:string]:WebSocket[]
}

export interface CustomJwtPayload extends JwtPayload {
    userId: string;
}