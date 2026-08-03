
import { User } from "../models/user.js";

export const getLogin = (req,res,next)=>{
    // const isLoggedIn = req.get("Cookie").split("=")[1];
    // console.log(isLoggedIn);
    //then u can pass isAuth as value isLoggedIn but this
    //is a bad example cuz the thing is u can manipulate data in cookies 
    console.log(req.session.isLoggedIn);
    res.render("auth/login",{path:"/login",pageTitle:"login",isAuth:req.session.isLoggedIn});
};
export const postLogin = (req,res,next)=>{
    // setting a cookie
    // res.setHeader("Set-Cookie","loggedIn=true; Max-Age=10");
    User.findByPk(1)
        .then(user=>{
            // making a param for user
            req.session.isLoggedIn = true;
            req.session.userId = user.id;
            req.session.save(err=>{
                console.log(err);
                res.redirect("/");
            })
        })
        .catch(err=>console.log(err));
}
export const postLogout = (req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect("/");
    });
};
export const getSignup = (req,res,next)=>{
    res.render("auth/signup",{path:"/signup",pageTitle:"SignUp",isAuth:req.session.isLoggedIn});
};