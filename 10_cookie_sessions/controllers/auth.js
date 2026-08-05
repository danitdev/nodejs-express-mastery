import bcrypt from "bcryptjs";
import { User } from "../models/user.js";

export const getLogin = (req,res,next)=>{
    // const isLoggedIn = req.get("Cookie").split("=")[1];
    // console.log(isLoggedIn);
    //then u can pass isAuth as value isLoggedIn but this
    //is a bad example cuz the thing is u can manipulate data in cookies 
    res.render("auth/login",{path:"/login",pageTitle:"login",errorMsg:req.flash("error")});
};
export const postLogin = (req,res,next)=>{
    // setting a cookie
    // res.setHeader("Set-Cookie","loggedIn=true; Max-Age=10");
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({where:{email:email}})
        .then(user=>{
            if(!user) 
            {
                req.flash("error","Invalid email or password.");
                return res.redirect("/login");
            }
            bcrypt.compare(password,user.password)
                .then(doMatch=>{
                    if(doMatch){
                        req.session.isLoggedIn = true;
                        req.session.userId = user.id;
                        req.session.save(err=>{
                            console.log(err);
                            res.redirect("/");
                        })
                    }
                    else{
                        res.redirect("/login");
                    }
                })
                .catch(err=>{
                    console.log(err);
                    res.redirect("/login");
                });
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
    res.render("auth/signup",{path:"/signup",pageTitle:"SignUp"});
};
export const postSignup = (req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(password !== confirmPassword) return res.redirect("/signup");
    User.findOne({where:{email: email}})
        .then(user=>{
            if(user){
                res.redirect("/signup");
                // console.log("user alread exist!");
                return Promise.reject();
            }
            return bcrypt.hash(password,12);
        })
        .then(hashedPass=>{
            if(!hashedPass) return;
            const newUser = new User({
                name,
                email,
                password:hashedPass
            });
            return newUser.save();
        })
        .then(user=>{
            if(!user) return;
            return user.createCart();
        })
        .then(cart=>{
            if(cart){
                res.redirect("/login");
            }
        })
        .catch(err=>console.log(err));
}