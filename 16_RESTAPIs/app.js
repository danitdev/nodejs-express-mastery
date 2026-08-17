import express from "express";
import bodyParser from "body-parser";
import {router as feedRouter} from "./routes/feed.js";


const app = express();


app.use(bodyParser.json()); //application/json

// GET /feed/posts
app.use("/feed",feedRouter);


app.listen(8080);