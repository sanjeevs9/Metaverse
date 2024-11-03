const arr =  []

const print = async () =>{
    const response = await arr.shift()

    if (response){
      console.log(response)
    }else{
        console.log('waiting...')
        await new Promise((r)=>{setTimeout(r,0)})
        print()
    }

}

arr.push(1)
print()
print()
setTimeout(()=>{
    arr.push(2)
},0)
