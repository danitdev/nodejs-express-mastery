import express from "express";
import rootDir from "../utils/path.js";
import { products } from "./admin.js";
import path from "path";
const router = express.Router();

router.get("/",(req,res,next)=>{
    // in render specify which file
    // inject products for dynamic adding
    res.render("shop",{prods: products,pageTitle:"Shop",path:"/shop"});

});


export{router};