import express from "express";
import rootDir from "../utils/path.js";
import path from "path";
// set router(router is like mini app)
const router = express.Router();
const users = ["ali ahmadi","danial hamidzadeh","asghar ahmadi","elham hamidzadeh"]
//so the /admin path is injected and filtered in main file and it passes
//to this file but here we don't need to write it anymore
//unless if there is a form like below we have to specify /admin/....
router.get("/users",(req,res,next)=>{
    res.render("users",{pageTitle:"Users",path:"/users",users:users});
});


export{router};