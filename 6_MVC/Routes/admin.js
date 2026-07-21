import express from "express";
// add get and post controller
import { getAddProduct,postAddProduct } from "../controllers/products.js";
// set router(router is like mini app)
const router = express.Router();


// using the controller getAddProduct
router.get("/add-product",getAddProduct);
//app.get is same as app.use but limit the req we have also app.post
router.post("/add-product",postAddProduct);


export{router};