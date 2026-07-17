import express from "express";
const router = express.Router();

router.use("/",(req,res,next)=>{
    res.send("<h1>other than the those</h1>");
});


export{router};