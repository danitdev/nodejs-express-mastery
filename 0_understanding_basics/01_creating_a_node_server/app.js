/*Core Modules:
http - https - fs - path - ls
http and https for creating server*/ 
import * as http from "http";
import * as fs from "fs";
// or another way 
// const http = require("http");
// function rqListener(req,res){

// }
// http.createServer(rqListener);
const server = http.createServer((req,res)=>{
    // console.log(req.url,req.method,req.headers);
    const url = req.url; // parsing url
    const method = req.method;
    if(url==="/"){
        res.setHeader("Content-Type","text/html");
        res.write("<html>");
        res.write("<head><title>Enter message:</title></head>");
        res.write("<body><form action='/msgShow' method='POST'><input type='text' name='msg'><button type='submit'>Send</button></form></body>")
        res.write("</html>");
        return res.end(); 
    }
    if(url==="/msgShow"&&method ==="POST"){
        const body = [];
        req.on("data",(chunck)=>{
            console.log(chunck);
            body.push(chunck);
        });
        req.on("end",()=>{
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[1];
            fs.writeFileSync("message.txt",message);
        });
        res.statusCode = 302;
        res.setHeader("Location","/");
        return res.end();
    }
    res.setHeader("Content-Type","text/html");
    res.write("<html>");
    res.write("<head><title>My first page</title></head>");
    res.write("<body><h1>hello from my node.js server!</h1></body>")
    res.write("</html>");
    res.end(); 
    // after writing all data we have to res.end
    // after we get the req it exit
    process.exit();
});
server.listen(5900);
/* Node Lifecycle And Event Loop : until there is things like listening and create
servers the program will be running until we exit
from it */
// with process.exit();