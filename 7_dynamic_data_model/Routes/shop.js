import express from "express";
// add getShop controller
import { getShop , getIndex , getCart, getCheckout,getOrders} from "../controllers/shop.js";
const router = express.Router();

router.get("/",getIndex);
router.get("/products",getShop);
router.get("/cart",getCart);
router.get("/checkout",getCheckout)
router.get("/orders",getOrders);
export{router};