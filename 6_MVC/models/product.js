import fs from "fs";
import path from "path";
import rootDir from "../utils/path.js";
import { json } from "body-parser";
const p = path.join(rootDir,"data","products.json");
class Product{
    constructor(title){
        this.title = title;
    }
    save(){
        fs.readFile(p,(err,fileContent)=>{
            let products = [];
            if(!err){
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log(err);
            });
        });
    }
    static fetchAll(cb){
        fs.readFile(p,(err,fileContent)=>{
            if(err){
                cb([]);
            }
            cb(JSON.parse(fileContent));
        });
    }
}
export{Product};