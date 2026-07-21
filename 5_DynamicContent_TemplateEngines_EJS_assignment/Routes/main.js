import express from "express";
import rootDir from "../utils/path.js";

import path from "path";
const router = express.Router();

router.get("/main",(req,res,next)=>{
    // in render specify which file
    // inject products for dynamic adding
    res.render("main",{pageTitle:"Main",path:"/main"});

});


export{router};