import express from "express";
// add getShop controller
import { getProducts,getProduct , getIndex , getCart, postCart, getCheckout,getOrders, postCartDeleteProduct, postOrder} from "../controllers/shop.js";
const router = express.Router();

router.get("/",getIndex);
router.get("/products",getProducts);
router.get("/products/:productId",getProduct);
router.get("/cart",getCart);
router.post("/cart",postCart); 
router.post("/cart-delete-item",postCartDeleteProduct);
router.get("/checkout",getCheckout)
router.post("/create-order",postOrder);
router.get("/orders",getOrders);

export{router};