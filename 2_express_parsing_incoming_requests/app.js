import express from "express";
import bodyParser from "body-parser";
import {router as adminRouter} from "./Routes/admin.js";
import {router as shopRouter} from "./Routes/shop.js";


const app = express();
// this pass a middleware function and it does the whole body parsing we were used to do and then next() to them
app.use(bodyParser.urlencoded({extended: false}));

app.use("/admin",adminRouter); //the "/admin" filter the path 
app.use("/shop",shopRouter);
// handling other pages
app.use((req,res,next)=>{
    // u can chain status with send to set status
    res.status(404).send("<h1>Page Not Found</h1>");
})


app.listen(3000);