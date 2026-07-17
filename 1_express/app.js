// import http from "http";
import express from "express";
const app = express();

// adding a middleware function
// next is used for traveling to another middlewere
// app.use((req,res,next)=>{
//     console.log("in the middleware!");
//     next(); // allowsthe req to continue in the next middleware
// });
app.use("/",(req,res,next)=>{
    console.log("this always runs first!");
    next();
});
app.use("/add_product",(req,res,next)=>{ 
    console.log("in another middleware!");
    res.send("<h1>add product route</h1>");

});
app.use("/",(req,res,next)=>{ //the "/" is the route but it doesn't mean exactly / it only has to contain / 
    console.log("in another middleware!");
    // sending a response
    // the difference with the http is it set the header itself
    res.send("<h1>hello from express</h1>");

});


// u can pass express to http.createServer 
// but it handles non
// it only sets up a way of handling 
// const server = http.createServer(app);
// server.listen(3000);
// short ver of two line of the code above
app.listen(3000);