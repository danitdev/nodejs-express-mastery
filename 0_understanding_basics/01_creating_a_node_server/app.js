/*Core Modules:
http - https - fs - path - ls
http and https for creating server*/ 
import * as http from "http";
import { reqHandeler } from "./routes.js"; 
// import * as fs from "fs";
// or another way 
// const http = require("http");
// function rqListener(req,res){

// }
// http.createServer(rqListener);
const server = http.createServer(reqHandeler);
server.listen(5900);
/* Node Lifecycle And Event Loop : until there is things like listening and create
servers the program will be running until we exit
from it */
// with process.exit();