import express from "express";
import { getLogin, getSignup, postLogin, postLogout } from "../controllers/auth.js";

const router = express.Router();

router.get("/login",getLogin);
router.post("/login",postLogin);
router.post("/logout",postLogout);
router.get("/signup",getSignup);

export{router};