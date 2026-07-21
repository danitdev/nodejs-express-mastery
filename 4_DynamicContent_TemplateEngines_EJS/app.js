import express from "express";
import path from "path";
import bodyParser from "body-parser";
import {router as adminRouter,products} from "./Routes/admin.js";
import {router as shopRouter} from "./Routes/shop.js";
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


app.use("/admin",adminRouter); //the "/admin" filter the path 
app.use("/shop",shopRouter);
// handling other pages
app.use((req,res,next)=>{
    // u can chain status with send to set status
    // passing the page title for ejs
    res.status(404).render("404",{pageTitle:"Page Not Found"});
})


app.listen(3000);