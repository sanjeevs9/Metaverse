const arr=[1,2,3,4];
const values=Promise.all(
    arr.map( (i)=>{
         new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve(console.log(i))
            },1000);
        })
        
        
    })
).then((res)=>{
    console.log("inside");
   
    
    
})
console.log("hiiii");
