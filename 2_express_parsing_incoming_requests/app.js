import express from "express";
import bodyParser from "body-parser";
const app = express();
// this pass a middleware function and it does the whole body parsing we were used to do and then next() to them
app.use(bodyParser.urlencoded());

app.use("/add-product",(req,res,next)=>{
    res.send(`<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product!</button></form>`);
});
app.use("/product",(req,res,next)=>{
    // redirect 
    console.log(req.body);
    res.redirect("/");
});
app.use("/",(req,res,next)=>{
    res.send("<h1>other than the those</h1>");
});


app.listen(3000);