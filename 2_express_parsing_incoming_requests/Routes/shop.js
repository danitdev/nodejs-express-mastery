import express from "express";
import path from "path";
const router = express.Router();

router.get("/",(req,res,next)=>{
    // serve the html file using res.sendFile
    res.sendFile(path.join(__dirname,"Views","shop.html"));
});


export{router};