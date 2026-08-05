import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    auth:{
        user:"resend",
        pass: process.env.RESEND_API_KEY
    }
});


export const getLogin = (req,res,next)=>{
    // const isLoggedIn = req.get("Cookie").split("=")[1];
    // console.log(isLoggedIn);
    //then u can pass isAuth as value isLoggedIn but this
    //is a bad example cuz the thing is u can manipulate data in cookies 
    let message = req.flash("error");
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render("auth/login",{path:"/login",pageTitle:"login",errorMsg:message});
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
                        req.flash("error","Invalid email or password.");
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
    let message = req.flash("error");
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render("auth/signup",{path:"/signup",pageTitle:"SignUp",errorMsg:message});
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
                req.flash("error","E-Mail exists already, pick an another E-Mail.");
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
                transporter.sendMail({
                    to:email,
                    from:"daniDev@resend.dev",
                    subject:"Singup? Cool!",
                    html:"<h1>You Signed Up!</h1>"
                })
                    .then(result=>{
                        console.log("email sent to user.")
                    })
                    .catch(err=>console.log(err));
                res.redirect("/login");
            }
        })
        .catch(err=>console.log(err));
}
export const getReset = (req,res,next)=>{
    let message = req.flash("error");
    if(message.length>0){
        message = message[0];
    }else{
        message = null;
    }
    res.render("auth/reset",{path:"/reset",pageTitle:"Reset Password",errorMessage:message})
}
export const postReset = (req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect("/reset");
        }
        const token = buffer.toString("hex");
        User.findOne({where:{email:req.body.email}})
            .then(user=>{
                if(!user){
                    req.flash("error","No Account With that email found.");
                    return res.redirect("/reset");
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result=>{
                if(result){
                    transporter.sendMail({
                        to: req.body.email,
                        from:"daniDev@resend.dev",
                        subject:"Password reset",
                        html:`
                        <p>you reseted password reset.</p>
                        <p>click this <a href="http://localhost:3000/reset/${token}"> link </a>to set a new password</p>
                        `
                    })
                        .then(result=>console.log("sent email"))
                        .catch(err=>{console.log(err)});
                }
            })
            .catch(err=>console.log(err));
    });
}