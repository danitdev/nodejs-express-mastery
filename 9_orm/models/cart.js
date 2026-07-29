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
    static deleteProduct(id,prodPrice){
        fs.readFile(p,(err,fileContent)=>{
            const cart = {...JSON.parse(fileContent)};
            if(err) return;
            const updatedCart = {...cart};
            const productIndex = updatedCart.products.findIndex(prod=>prod.id===id);
            const productToDelete = updatedCart.products[productIndex];
            if(!productToDelete) return;
            updatedCart.products = updatedCart.products.filter(p=>p.id!==id);
            updatedCart.totalPrice -= productPrice * productToDelete.qty;
            fs.writeFile(p,JSON.stringify(updatedCart),err=>{
                console.log(err);
            });
        });

    }
    static getCart(cb){
        fs.readFile(p,(err,fileContent)=>{
            const cart = JSON.parse(fileContent);
            if(err){
                cb(null);
            }
            else{
                cb(cart);
            }
        });
    }
}
export{Cart};