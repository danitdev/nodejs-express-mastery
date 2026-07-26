import fs from "fs";
import path from "path";
import rootDir from "../utils/path.js";
const p = path.join(rootDir,"data","cart.json");


class Cart{
    static addProduct(id,prodPrice){
        //fetch the prev cart
        fs.readFile(p,(err,fileContent)=>{
            let cart = {products:[],totalPrice:0}
            if(!err){
                cart = JSON.parse(fileContent);
            }
            //analyze the cart =>  find existing product
            const existingProductIndex = cart.products.findIndex(p=>p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            //add new product/ increase quantity
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty+1;
                cart.products[existingProductIndex] = updatedProduct;
            }
            else{
                updatedProduct = {id: id, qty:1};
                cart.products = [...cart.products,updatedProduct];
            }
            //add a plus behind prodPrice to convert it to number
            cart.totalPrice =cart.totalPrice + +prodPrice;
            fs.writeFile(p,JSON.stringify(cart),err=>{
                console.log(err);
            })

        });
    }

}
export{Cart};