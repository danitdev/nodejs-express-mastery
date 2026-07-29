import express from "express";
import bodyParser from "body-parser";
import {router as adminRouter} from "./Routes/admin.js";
import {router as shopRouter} from "./Routes/shop.js";
import path from "path";
import rootDir from "./utils/path.js";
import { throw404 } from "./controllers/error.js";
import {sequelize} from "./utils/database.js";
//add models
import { Product } from "./models/product.js";
import { User } from "./models/user.js";


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

app.use((req,res,next)=>{
    User.findByPk(1)
        .then(user=>{
            // making a param for user
            req.user = user;
            next();
        })
        .catch(err=>console.log(err));
});
app.use("/admin",adminRouter); //the "/admin" filter the path 
app.use(shopRouter);
// handling other pages
app.use(throw404)


//associations(relations)
Product.belongsTo(User,{constraints: true,onDelete:"CASCADE"});
User.hasMany(Product);

//sync the models to db and creating the table in db
sequelize.sync()
    .then(result=>{
        return User.findByPk(1);
        // console.log(result);
    })
    .then(user=>{
        if(!user){
            return User.create({name:"dani",email:"danibignarty@gmail.com"})
        }
        return user;
    })
    .then(user=>{
        console.log(user);
        app.listen(3000);
    })
    .catch(err=>{console.log(err);})
