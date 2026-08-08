import express from "express";
// add get and post controller
import { getAddProduct,postAddProduct, getAdminProducts, getEditProduct, postEditProduct, postDeleteProduct} from "../controllers/admin.js";
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
            .isAlphanumeric().isLength({min:3}).trim(),
        body("imageUel")
            .isURL(),
        body("price")
            .isFloat(),
        body("description")
            .isLength({min:5,max:500})
    ],isAuth,postAddProduct);
router.get("/edit-product/:productId"
    , 
    [
        body("title")
            .isString().isLength({min:3}).trim(),
        body("imageUel")
            .isURL(),
        body("price")
            .isFloat(),
        body("description")
            .isLength({min:5,max:500})
    ]
    ,isAuth,getEditProduct);
router.post("/edit-product",isAuth,postEditProduct);
router.post("/delete-product",isAuth,postDeleteProduct);
export{router};