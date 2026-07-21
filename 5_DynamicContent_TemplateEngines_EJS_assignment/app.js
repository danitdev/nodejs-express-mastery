import express from "express";
import path from "path";
import bodyParser from "body-parser";
import {router as users} from "./Routes/users.js";
import {router as main} from "./Routes/main.js";
import rootDir from "./utils/path.js"


const app = express();
// set ejs
app.set("view engine","ejs");
// set views folder
app.set("views","Views");



// this pass a middleware function and it does the whole body parsing we were used to do and then next() to them
app.use(bodyParser.urlencoded({extended: false}));
// giving acess to users have this static files
// can be images css files... 
// but u have to remember now u are in public dir
//and in html files if there is link u have to think u are in public and give the direction from there
app.use(express.static(path.join(rootDir,"public")));


app.use(users); //the "/admin" filter the path 
app.use(main);
// handling other pages



app.listen(3000);