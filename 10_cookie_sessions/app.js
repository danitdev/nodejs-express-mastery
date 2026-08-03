import express from "express";
import bodyParser from "body-parser";
import {router as adminRouter} from "./Routes/admin.js";
import {router as shopRouter} from "./Routes/shop.js";
import {router as authRouter} from "./Routes/auth.js";
import path from "path";
import rootDir from "./utils/path.js";
import { throw404 } from "./controllers/error.js";
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
// set ejs
app.set("view engine","ejs");
// set views folder
app.set("views","views");

// this pass a middleware function and it does the whole body parsing we were used to do and then next() to them
app.use(bodyParser.urlencoded({extended: false}));
// giving acess to users have this static files
// can be images css files... 
// but u have to remember now u are in public dir
//and in html files if there is link u have to think u are in public and give the direction from there
app.use(express.static(path.join(rootDir,"public")));
app.use(session({secret:"my secret",resave:false,saveUninitialized:false,store:store}));

app.use((req,res,next)=>{
    if(!req.session.userId){
        return next();
    }
    User.findByPk(req.session.userId)
        .then(user=>{
            req.user = user;
            next();
        })
        .catch(next);
});
app.use("/admin",adminRouter); //the "/admin" filter the path 
app.use(shopRouter);
app.use(authRouter);
// handling other pages
app.use(throw404);


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
sequelize.sync()
    .then(()=>{
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err);
    });