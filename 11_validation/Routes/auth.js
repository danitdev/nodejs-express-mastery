import express from "express";
import {check} from "express-validator";
import { getLogin, getNewPassword, getReset, getSignup, postLogin, postLogout, postNewPassword, postReset, postSignup } from "../controllers/auth.js";

const router = express.Router();

router.get("/login",getLogin);
router.post("/login",postLogin);
router.post("/logout",postLogout);
router.get("/signup",getSignup);
//add validation as middleware check for email with isEmail function
router.post("/signup",check("email")
                    .isEmail()
                    .withMessage("Please enter a valid email.")
                    //a custom validator
                    .custom((value,{req})=>{
                        if(value === "test@test.com"){
                            throw new Error("this email address is forbidden.");
                        }
                        return true;
                    }),
                    postSignup);
router.get("/reset",getReset);
router.post("/reset",postReset);
router.get("/reset/:token",getNewPassword);
router.post("/new-password",postNewPassword);

export{router};