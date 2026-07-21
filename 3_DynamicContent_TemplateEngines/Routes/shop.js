import express from "express";
import rootDir from "../utils/path.js";
import { products } from "./admin.js";
import path from "path";
const router = express.Router();

router.get("/",(req,res,next)=>{
    console.log(products);
    // serve the html file using res.sendFile
    res.sendFile(path.join(rootDir,"Views","shop.html"));
});


export{router};