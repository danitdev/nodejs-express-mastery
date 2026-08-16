import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import { Op} from "sequelize";
import nodemailer from "nodemailer";
import "dotenv/config";
import {validationResult} from "express-validator";

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
    res.render("auth/login",{path:"/login",pageTitle:"login",errorMsg:message,oldInput:{email:"",password:""}});
};
export const postLogin = (req,res,next)=>{
    // setting a cookie
    // res.setHeader("Set-Cookie","loggedIn=true; Max-Age=10");
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty){
        res.status(422).render("auth/login",{path:"/login",pageTitle:"login",errorMsg:errors.array()[0].msg,oldInput:{email:email,password:password}});
    }
    //this is a logic validation it can be moved to routes but not that importent
    User.findOne({where:{email:email}})
        .then(user=>{
            if(!user) 
            {
                return res.status(422).render("auth/login",{path:"/login",pageTitle:"login",errorMsg:"Invalid email or password",oldInput:{email:email,password:password}});
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
                        return res.status(422).render("auth/login",{path:"/login",pageTitle:"login",errorMsg:"Invalid email or password",oldInput:{email:email,password:password}});
                    }
                })
                .catch(err=>{
                    console.log(err);
                    res.redirect("/login");
                });
        })
        .catch(err=>{
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
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
    res.render("auth/signup",{path:"/signup",pageTitle:"SignUp",errorMsg:message,oldInput:{name:"",email:"",password:"",confirmPassword:""},validationErrors:[]});
};
export const postSignup = (req,res,next)=>{
    //getting errors from that validation
    const errors = validationResult(req);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render("auth/signup",{path:"/signup",pageTitle:"SignUp",errorMsg:errors.array()[0].msg,oldInput:{name:name,email:email,password:password,confirmPassword:req.body.confirmPassword},validationErrors:errors.array()});
    }
    //email validation is handled in route async
    bcrypt.hash(password,12)
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
                    .catch(err=>{
                        console.error("Failed to send singup email:",err);
                    });
                res.redirect("/login");
            }
        })
        .catch(err=>{
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
                    res.redirect("/");
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
                        .catch(err=>{
                            const error =  new Error(err);
                            error.httpStatusCode = 500;
                            return next(error);
                        });
                }
            })
            .catch(err=>{
                const error =  new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    });
};
export const getNewPassword = (req,res,next)=>{
    const token = req.params.token;
    User.findOne({where:{resetToken:token,resetTokenExpiration:{[Op.gt]: Date.now()}}})
        .then(user=>{
            let message = req.flash("error");
            if(message.length > 0){
                message = message[0];
            }else{
                message = null;
            }
            res.render("auth/new-password",{
                path:"/new-password",
                pageTitle:"Reset Password",
                errorMsg:message,
                userId: user.id,
                passwordToken:token
            });
        })
        .catch(err=>{
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
export const postNewPassword = (req,res,next)=>{
    let resetUser;
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    User.findOne({where:{resetToken:passwordToken,resetTokenExpiration:{[Op.gt]:Date.now()},id:userId}})
        .then(user=>{
            resetUser = user;
            return bcrypt.hash(newPassword,12)
        })
        .then(hashedPassword=>{
            resetUser.password = hashedPassword;
            resetUser.resetToken = null;
            resetUser.resetTokenExpiration = null;
            return resetUser.save();
        })
        .then(result=>{
            transporter.sendMail({
                        to: resetUser.email,
                        from:"daniDev@resend.dev",
                        subject:"Password Got reseted",
                        html:`
                        <p>you reseted your password.</p>
                        <p>if it wasn't u i can do nothing D:.</p>
                        `
                    })
                    .then(result=>{
                        req.flash("error","your password got reset.")
                        res.redirect("/login");
                    })
                    .catch(err=>{
                        const error =  new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                    });
        })
        .catch(err=>{
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}