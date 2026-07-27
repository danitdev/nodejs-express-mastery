import fs from "fs";
import path from "path";
import rootDir from "../utils/path.js";
import crypto from "crypto";
import { json } from "body-parser";

const p = path.join(rootDir,"data","products.json");
const getProductsFromFile = cb=>{
    const p = path.join(rootDir,"data","products.json");
    fs.readFile(p,(err,fileContent)=>{
        if(err){
            cb([]);
        }else{
            cb(JSON.parse(fileContent));
        }
    });
}

class Product{
    constructor(id,title,imageUrl,desc,price){
        // adding random UUID using crypto
        this.id = id || crypto.randomUUID();
        this.title = title;
        this.imageUrl = imageUrl;
        this.desc = desc;
        this.price = price;
    }
    save(){
        getProductsFromFile(products=>{
            const existingProductIndex = products.findIndex(p=>p.id === this.id);
            console.log(existingProductIndex);
            // if the product already exist update it
            if(existingProductIndex>=0){
                console.log("existed");
                const updatingProducts = [...products];
                updatingProducts[existingProductIndex] = this;
                fs.writeFile(p,JSON.stringify(updatingProducts),(err)=>{
                console.log(err);
            });
            }
            // else create a new one
            else{
                console.log("creating new one...");
                products.push(this);
                fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log(err);
                });
            }
            
        });
    }
    static fetchAll(cb){
        getProductsFromFile(cb);
    }
    static findById(id,cb){
        getProductsFromFile(products=>{
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}
export{Product};