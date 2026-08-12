import express from "express";
import bodyParser from "body-parser";
import csrf from "csurf";
import flash from "connect-flash";
import multer from "multer";
import {router as adminRouter} from "./Routes/admin.js";
import {router as shopRouter} from "./Routes/shop.js";
import {router as authRouter} from "./Routes/auth.js";
import path from "path";
import rootDir from "./utils/path.js";
import { throw404, throw500 } from "./controllers/error.js";
import {sequelize} from "./utils/database.js";
//add models
import { Product } from "./models/product.js";
import { User } from "./models/user.js";
import { Cart } from "./models/cart.js";
import { CartItem } from "./models/cart-item.js";
import { Order } from "./models/order.js";
import { OrderItem } from "./models/order-item.js";
//import session
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";

const SequelizeStore = connectSessionSequelize(session.Store);
const  store = new SequelizeStore({
    db: sequelize
});

// add 404 controller
const app = express();
//init csrf
const csrfProtection = csrf();

//setting up the file storage for multer
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images");
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString+"-"+file.originalname);
    }
});
const fileFilter = (req,file,cb)=>{
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg"||file.mimetype === "image/jpeg"){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};


// set ejs
app.set("view engine","ejs");
// set views folder
app.set("views","views");

// this pass a middleware function and it does the whole body parsing we were used to do and then next() to them
app.use(bodyParser.urlencoded({extended: false}));
//adding multer - single for single image input - and image for the name input
app.use(multer({fileStorage:fileStorage,fileFilter:fileFilter}).single("image"));

// giving acess to users have this static files
// can be images css files... 
// but u have to remember now u are in public dir
//and in html files if there is link u have to think u are in public and give the direction from there
app.use(express.static(path.join(rootDir,"public")));
app.use(session({secret:"my secret",resave:false,saveUninitialized:false,store:store}));

//using its middleware
app.use(csrfProtection);
//flash message middleware
app.use(flash());

// passing local values (like passing things to views but here it is passed to everything)
//changing order for this cuz of error handling
app.use((req,res,next)=>{
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req,res,next)=>{
    if(!req.session.userId){
        return next();
    }
    User.findByPk(req.session.userId)
        .then(user=>{
            if(!user){
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err=>{
            next(new Error(err));
        });
});



app.use("/admin",adminRouter); //the "/admin" filter the path 
app.use(shopRouter);
app.use(authRouter);
// handling other pages
app.use(throw404);
app.get(throw500)
//centeral error handling middleware
app.use((err,req,res,next)=>{
    // res.redirect("/500");
    //we can avoid infinite loop with this:
    res.status(500).render("500",{pageTitle:"Error!",path:"/500"});
});
//associations(relations)
Product.belongsTo(User,{constraints: true,onDelete:"CASCADE"});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through: CartItem});
Product.belongsToMany(Cart,{through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});


store.sync()    
    .then(()=>{
        console.log("SYNC STORE....");
    })
    .catch(err=>console.log(err));
//sync the models to db and creating the table in db
sequelize.sync({force:false})
    .then(()=>{
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err);
    });