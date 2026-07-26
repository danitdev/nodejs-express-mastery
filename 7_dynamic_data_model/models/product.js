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
    constructor(title,imageUrl,desc,price){
        // adding random UUID using crypto
        this.id = crypto.randomUUID();
        this.title = title;
        this.imageUrl = imageUrl;
        this.desc = desc;
        this.price = price;
    }
    save(){
        getProductsFromFile(products=>{
            products.push(this);
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log(err);
            });
        });
    }
    static fetchAll(cb){
        getProductsFromFile(cb);
    }
}
export{Product};