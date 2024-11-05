import express, { Response,Request } from "express"
import authMiddleware from "../middleware/authMiddleware";
import { CreateSpace } from "../middleware/Zodvalidation";
import client from "..";
import { ZodError } from "zod";
import { addElement } from "../middleware/Zodvalidation";

const router =express.Router()
export default  router;

//create a Space 
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
        if(!body.mapId){
            const space=await client.space.create({
                data:{
                    name:body.name,
                    height:x,
                    width:y,
                    creatorId:userId,
                }
            })
    
            res.json({
                "spaceId":space.id,
                "message":"new space"
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
                    data: map.elements.map((x:any)=>({
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
//add an element
router.post("/element",authMiddleware,async(req:Request,res:Response)=>{
    const body=req.body;
    const userId=res.locals.userId;
    
    
    try{
        await addElement.parseAsync(body);

        const space = await client.space.findUnique({
            where: {
                id: req.body.spaceId,
                creatorId: userId
            }, select: {
                width: true,
                height: true
            }
        })
        if(req.body.x < 0 || req.body.y < 0 || req.body.x > space?.width! || req.body.y > space?.height!) {
            res.status(400).json({message: "Point is outside of the boundary"})
            return
        }
        if (!space) {
            res.status(400).json({message: "Space not found"})
            return
        }

        console.log(body.x,body.y);
        


        await client.spaceElements.create({
            data:{
                x:body.x,
                y:body.y,
                elementId:body.elementId,
                spaceId:body.spaceId
            }
        })
        res.json({
            message:"element added"
        })
        return

    }catch(err){
        res.json({message:err})
        return
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

router.get("/:spaceId",authMiddleware,async (req:Request,res:Response)=>{
    const {spaceId}=req.params
    console.log(spaceId);
    
    try{
        const space=await client.space.findUnique({
            where:{
                id:spaceId
            },
            include:{
                spaceElements:{
                    select:{
                        id:true,
                        x:true,
                        y:true,
                        elemendid:true
                    }

                }
            }
        })
         res.json({
            space
        })
        return 
    }catch(err){
            res.status(400).json({
                message:err
            })
            return
    }
})




//delete a element from space
router.post("/element/:elementId",authMiddleware,async(req:Request,res:Response)=>{
    const {elementId}=req.params
    if(!elementId){
        res.json({
            message:"give id"
        })
        return
    }
    try{
        await client.spaceElements.delete({
            where:{
                id:elementId
            }
        })
        res.json({
            message:"deleted"
        })

    }catch(err){
        res.json({
            err
        })
        return
    }
})
