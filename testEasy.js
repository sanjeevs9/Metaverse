dimensions="100x200";

let x;
let y;
if(!dimensions){
    x=100
    y=200
}
x=dimensions.split("x")[0];
y=dimensions.split("x")[1];

console.log(x+" "+ y);
