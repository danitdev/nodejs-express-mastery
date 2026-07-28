import express from "express";
import bodyParser from "body-parser";
import {router as adminRouter} from "./Routes/admin.js";
import {router as shopRouter} from "./Routes/shop.js";
import path from "path";
import rootDir from "./utils/path.js";
import { throw404 } from "./controllers/error.js";
import { poolPromise as db } from "./utils/database.js";

// add 404 controller
const app = express();
// set ejs
app.set("view engine","ejs");
// set views folder
app.set("views","views");

db.execute("SELECT * FROM products")
    .then(result=>{
        console.log(result[0],result[1]);
    })
    .catch(err=>{
        console.log(err);
    });

// this pass a middleware function and it does the whole body parsing we were used to do and then next() to them
app.use(bodyParser.urlencoded({extended: false}));
// giving acess to users have this static files
// can be images css files... 
// but u have to remember now u are in public dir
//and in html files if there is link u have to think u are in public and give the direction from there
app.use(express.static(path.join(rootDir,"public")));


app.use("/admin",adminRouter); //the "/admin" filter the path 
app.use(shopRouter);
// handling other pages
app.use(throw404)


app.listen(3000);