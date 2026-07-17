import http from "http";
import express from "express";
const app = express();

// adding a middleware function
// next is used for traveling to another middlewere
app.use((req,res,next)=>{
    console.log("in the middleware!");
    next(); // allowsthe req to continue in the next middleware
});
app.use((req,res,next)=>{
    console.log("in another middleware!");
})


// u can pass express to http.createServer 
// but it handles non
// it only sets up a way of handling 
const server = http.createServer(app);
server.listen(3000);