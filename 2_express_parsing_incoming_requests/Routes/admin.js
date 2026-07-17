import express from "express";

// set router(router is like mini app)
const router = express.Router();


router.get("/add-product",(req,res,next)=>{
    res.send(`<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product!</button></form>`);
});
//app.get is same as app.use but limit the req we have also app.post
router.post("/product",(req,res,next)=>{
    // redirect 
    console.log(req.body);
    res.redirect("/");
});


export{router};