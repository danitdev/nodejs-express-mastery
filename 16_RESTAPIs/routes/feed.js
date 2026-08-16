import e from "express"
import { getPosts } from "../controllers/feed.js";
const router = e.Router();

router.get("/posts",getPosts);


export{router};