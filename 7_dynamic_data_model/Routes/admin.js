import express from "express";
// add get and post controller
import { getAddProduct,postAddProduct, getAdminProducts, getEditProduct} from "../controllers/admin.js";
// set router(router is like mini app)
const router = express.Router();


// using the controller getAddProduct
router.get("/add-product",getAddProduct);
//app.get is same as app.use but limit the req we have also app.post
router.post("/add-product",postAddProduct);
router.get("/edit-product/:productId",getEditProduct);
// admin/products => GET
router.get("/products",getAdminProducts);


export{router};