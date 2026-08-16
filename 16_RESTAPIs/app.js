import express from "express"
import {router as feedRouter} from "./routes/feed.js";


const app = express();

// GET /feed/posts
app.use("/feed",feedRouter);


app.listen(8080);