import express from "express";
import {check, body} from "express-validator";
import { getLogin, getNewPassword, getReset, getSignup, postLogin, postLogout, postNewPassword, postReset, postSignup } from "../controllers/auth.js";
import { User } from "../models/user.js";
const router = express.Router();

router.get("/login",getLogin);
router.post("/login",postLogin);
router.post("/logout",postLogout);
router.get("/signup",getSignup);
//add validation as middleware check for email with isEmail function
router.post("/signup",
    [
    check("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
    //a custom validator
        .custom((value,{req})=>{
        //     if(value === "test@test.com"){
        //         throw new Error("this email address is forbidden.");
        //     }
        // return true;
        // express wait for us here cuz it is a promise
        return User.findOne({where:{email: value}})
        .then(user=>{
            if(user){
                return Promise.reject("E-Mail exists already, pick an another E-Mail.");
            }
        });
    }),
    body("password","please enter a password using numbers and text and at least 5 characters.")
        .isLength({min:8})
        .isAlphanumeric(),
    body("confirmPassword")
        .custom((value,{req})=>{
            if(value !== req.body.password){
                throw new Error("Passwords have to match.");
            }
            return true;
        })
    ],
    postSignup);
router.get("/reset",getReset);
router.post("/reset",postReset);
router.get("/reset/:token",getNewPassword);
router.post("/new-password",postNewPassword);

export{router};