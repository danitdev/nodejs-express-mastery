import express from "express";
// add getShop controller
import { getShop } from "../controllers/products.js";
const router = express.Router();

router.get("/",getShop);


export{router};