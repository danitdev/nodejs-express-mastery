import express from "express";
// add getShop controller
import { getProducts,getProduct , getIndex , getCart, postCart, getCheckout,getOrders, postCartDeleteProduct, postOrder} from "../controllers/shop.js";
import { isAuth } from "../middleware/is-auth.js";
const router = express.Router();

router.get("/",getIndex);
router.get("/products",getProducts);
router.get("/products/:productId",getProduct);
router.get("/cart",isAuth,getCart);
router.post("/cart",isAuth,postCart); 
router.post("/cart-delete-item",isAuth,postCartDeleteProduct);
// router.get("/checkout",getCheckout)
router.post("/create-order",isAuth,postOrder);
router.get("/orders",isAuth,getOrders);

export{router};