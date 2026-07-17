import express from "express";
import bodyParser from "body-parser";
import {router as adminRouter} from "./Routes/admin.js";
import {router as shopRouter} from "./Routes/shop.js";


const app = express();
// this pass a middleware function and it does the whole body parsing we were used to do and then next() to them
app.use(bodyParser.urlencoded());

app.use(adminRouter);
app.use(shopRouter);



app.listen(3000);