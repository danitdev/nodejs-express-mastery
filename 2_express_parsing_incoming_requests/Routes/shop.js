import express from "express";
const router = express.Router();

router.get("/",(req,res,next)=>{
    res.send("<h1>Welcome to Shop!</h1>");
});


export{router};