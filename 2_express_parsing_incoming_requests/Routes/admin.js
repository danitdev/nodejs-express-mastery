import express from "express";

// set router(router is like mini app)
const router = express.Router();

//so the /admin path is injected and filtered in main file and it passes
//to this file but here we don't need to write it anymore
//unless if there is a form like below we have to specify /admin/....
router.get("/add-product",(req,res,next)=>{
    res.send(`<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product!</button></form>`);
});
//app.get is same as app.use but limit the req we have also app.post
router.post("/add-product",(req,res,next)=>{
    // redirect 
    console.log(req.body);
    res.redirect("/");
});


export{router};