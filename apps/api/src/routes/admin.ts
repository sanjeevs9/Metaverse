import express,{Request,Response} from "express"
import authMiddleware from "../middleware/authMiddleware";
import client from "..";
import { createAvatar, CreateElement, CreateMap, updateElememt } from "../middleware/Zodvalidation";
import { ZodEffects, ZodError } from "zod";
const router=express()
export default router;


async function checkAdmin(userId:string){
    const user=await client.user.findUnique({
        where:{
            id:userId
        }
    })

    
    if(user?.role==="Admin"){
        return true
    }
    return false;
}

//create an element
router.post("/element",authMiddleware,async (req:Request,res:Response)=>{
    const userId:string=res.locals.userId;
    let body=req.body;

    try{
        const isAdmin=await checkAdmin(userId);
        if(!isAdmin){
            res.status(400).json({
               message:"only admins are allowed"
           })
           return
       }
        body=await CreateElement.parseAsync(body);

        
        const element=await client.element.create({
            data:{
                imageUrl:body.imageUrl,
                width:body.width,
                height:body.height,
                static:body.static
            }
        })
        res.json({
            id:element.id
        })
        return 
    }catch(err){
        if(err instanceof ZodError){
            res.json({
                message:err
            })
            return
        }
        res.status(402).json({
            err
        })
        return 
    }
})

//update an element
router.post("/element/:elementId",authMiddleware,async(req:Request,res:Response)=>{
    const body=req.body;
    const elementId=req.params.elementId
    const userId=res.locals.userId;
    

    try{
        const isAdmin=await checkAdmin(userId);
        if(!isAdmin){
            res.status(400).json({
               message:"only admins are allowed"
           })
           return
       }

        await updateElememt.parseAsync(body)
        const element=await client.element.update({
            where:{
                id:elementId
            },
            data:{
                imageUrl:body.imageUrl
            }
        })
        res.json({
            message:"image updated"
        })
        return 

    }catch(err){
        if(err instanceof ZodError){
            res.json({
                message:err
            })
            return 
        }
        res.json({
            err
        })
        return
    }
})

//create a avatar
router.post("/avatar",authMiddleware,async(req:Request,res:Response)=>{
    const body=req.body;
    const userId=res.locals.userId;
    try{
        const isAdmin=await checkAdmin(userId);
        if(!isAdmin){
            res.status(400).json({
               message:"only admins are allowed"
           })
           return
       }

        await createAvatar.parseAsync(body);
       const avatar=await client.avatar.create({
            data:{
                name:body.name,
                imageUrl:body.imageUrl
            }
       })
       res.json({
        "avatarId":avatar.id
       })
       return 

    }catch(err){
        res.json({
            err
        })
        return
    }
})

//create a map
router.post("/map",authMiddleware,async(req:Request,res:Response)=>{
    const body=req.body;
    const userId=res.locals.userId;
    try{
        const isAdmin=await checkAdmin(userId);
        if(!isAdmin){
            res.status(400).json({
               message:"only admins are allowed"
           })
           return
       }
       await CreateMap.parseAsync(body);
 
       
       const height=parseInt(body.dimensions.split("x")[0]);
       const width=parseInt(body.dimensions.split("x")[1]);
    
       
       
       
       let value= await client.$transaction(async(tx)=>{
           
         const map=await tx.map.create({
            data:{
                thumbmail:body.thumbnail,
                height,
                width,
                name:body.name,
            }  
        })
       
       
        await tx.mapElements.createMany({
            data:body.defaultElements.map((e:any)=>({
                mapId:map.id,
                elementId:e.elementId,
                x:e.x,
                y:e.y
            }))
        })
        return map;
       })
           res.json({
            id:value.id
            })
            return 


    }catch(err){
        res.json({
            err
        })
        return
    }
})