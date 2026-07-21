import express from "express";
import rootDir from "../utils/path.js";
import path from "path";
// set router(router is like mini app)
const router = express.Router();

const products = [];

//so the /admin path is injected and filtered in main file and it passes
//to this file but here we don't need to write it anymore
//unless if there is a form like below we have to specify /admin/....
router.get("/add-product",(req,res,next)=>{
    // static form html css handling
//    res.sendFile(path.join(rootDir,"Views","add-product.html"));
    res.render("add-product",{pageTitle:"Add Product",path:"/admin/add-product"});
});
//app.get is same as app.use but limit the req we have also app.post
router.post("/add-product",(req,res,next)=>{
    // redirect 
    products.push({title: req.body.title});
    console.log(req.body);
    res.redirect("/shop");
});


export{router, products};