import WebSocket from "ws";
import { room } from ".";

export async function onJoin(socket: WebSocket, userId: string, spaceId: string, x: number, y: number) {
    if (!room[spaceId]) {
        return;
    }
    //send to all users that someoneJoined
    const values = Array.from(room[spaceId].values())
    Promise.all(
        values.map(async (value) => {
            await new Promise((resolve, reject) => {
                if (value.webSocket != socket && value.webSocket.onopen) {
                    value.webSocket.send(JSON.stringify({
                        "type": "user-join",
                        "payload": {
                            "userId": userId,
                            x,
                            y
                        }
                    }))
                }
                resolve("")
            })
        })
    )
    //send new user to all other users details
    const keys = Array.from(room[spaceId].entries());
    const data = []
    for (const key of keys) {
        const value = {
            userId: key[0],
            payload: key[1].payload
        }
        data.push(value);
    }
    socket.send(JSON.stringify({
        type: "space-joined",
        "payload": {
            "spawn": {
                x,
                y
            },
            "users": data
        }
    }))
} 

export async function movement(socket:WebSocket,userId:string,spaceId:string,x:number,y:number){
    
}