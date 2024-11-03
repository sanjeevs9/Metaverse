import express, { Response,Request } from "express"
import authMiddleware from "../middleware/authMiddleware";
import { CreateSpace } from "../middleware/Zodvalidation";
import client from "..";
import { ZodError } from "zod";

const router =express.Router()
export default  router;

//create a Space with a exisiting mapId
router.post("/",authMiddleware, async (req:Request,res:Response)=>{
    const body=req.body
    const userId=res.locals.userId;

    try{
        await CreateSpace.parseAsync(body)
        let x;
        let y;
        if(!body.dimensions){
            x=100
            y=200
        }
        x=parseInt(body.dimensions.split("x")[0]);
        y=parseInt(body.dimensions.split("x")[1]);
        if(!body.spaceId){
            const space=await client.space.create({
                data:{
                    name:body.name,
                    height:x,
                    width:y,
                    creatorId:userId,
                }
            })
    
            res.json({
                "spaceId":space.id
            })
            return
        }

        const map=await client.map.findUnique({
            where:{
                id:body.mapId
            },select:{
                elements:true,
                width:true,
                height:true
            }
        })

        if(!map){
            res.status(200).json({
                message:"map not found"
            })
            return
        }
      let space= await client.$transaction(async ()=>{

            const space=await client.space.create({
                    data:{
                        name:body.name,
                        width:map.width,
                        height:map.height,
                        creatorId:userId
                    }
                })
                
                await client.spaceElements.createMany({
                    data: map.elements.map((x)=>({
                            elementId:x.elementId,
                            spaceId:space.id,
                            x:x.x!,
                            y:x.y!,
                        }))
                })
                return space
        })

        res.json({
            spaceId:space.id
        })
       return

    }catch(err){
        if(err instanceof ZodError){
             res.status(400)
             return 
        }else{
             res.status(400)
             return
        }
    }
})


//delete a Space
router.post("/:spaceId",authMiddleware,async(req:Request,res:Response)=>{
    const spaceId=req.params.spaceId
    const userId=res.locals.userId;
    try{
        await client.space.delete({
            where:{
                id:spaceId,
                creatorId:userId
            }
        })
          res.json({
            message:"space delte successfully"
        })
        return

    }catch(err){
        res.status(400).json({
            err
        })
        return
    }
})

//get my existing spaces
router.get("/all",authMiddleware,async(req:Request,res:Response)=>{
    const userId=res.locals.userId;
    try{
        const spaces=await client.space.findMany({
            where:{
                creatorId:userId
            }
        })

         res.json({
            spaces
        })
        return
    }catch(err){

    }
})