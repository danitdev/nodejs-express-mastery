/*Core Modules:
http - https - fs - path - ls
http and https for creating server*/ 
import * as http from "http";
// or another way 
// const http = require("http");
// function rqListener(req,res){

// }
// http.createServer(rqListener);
const server = http.createServer((req,res)=>{
    console.log(req);
});
server.listen(5900);