import express from "express";
// add get and post controller
import { getAddProduct,postAddProduct, getAdminProducts, getEditProduct, postEditProduct, deleteProduct} from "../controllers/admin.js";
// route protection using middleware
import { isAuth } from "../middleware/is-auth.js";
import {check, body} from "express-validator"
// set router(router is like mini app)
const router = express.Router();


// using the controller getAddProduct
router.get("/add-product",isAuth,getAddProduct);
//app.get is same as app.use but limit the req we have also app.post
// admin/products => GET
router.get("/products",isAuth,getAdminProducts);
router.post("/add-product",
    [
        body("title")
            .isString().isLength({min:3}).withMessage("The title has to be min of 3 chars.").trim(),
        body("price")
            .isFloat().withMessage("the price has to be decimal!"),
        body("description")
            .isLength({min:5,max:500})
            .withMessage("the description has to be min of 5 chars and 500 chars!")
    ]
    ,isAuth,postAddProduct);
router.get("/edit-product/:productId",isAuth,getEditProduct);
router.post("/edit-product",
    [
        body("title")
            .isString().isLength({min:3}).withMessage("The title has to be min of 3 chars.").trim(),
        body("price")
            .isFloat().withMessage("the price has to be decimal!"),
        body("description")
            .isLength({min:5,max:500})
            .withMessage("the description has to be min of 5 chars and 500 chars!")
    ]
    ,isAuth,postEditProduct);
router.delete("/product/:productId",isAuth,deleteProduct);
export{router};