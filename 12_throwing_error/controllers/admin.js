import { Product } from "../models/product.js";
import { validationResult } from "express-validator";
export const getAddProduct = (req,res,next)=>{
    //better was is using middleware
    // if(!req.session.isLoggedIn) return res.redirect("/login");
    res.render("admin/edit-product",{pageTitle:"Add Product",path:"/admin/add-product",editing:false,hasError:false,errorMsg:null,validationErrors:[]});
};

export const postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render("admin/edit-product",{
            pageTitle:"Add Product",
            path:"/admin/edit-product",
            editing:false,
            hasError:true,
            product:{
                title:title,
                imageUrl:imageUrl,
                price:price,
                description:description
            },
            isAuth:req.session.isLoggedIn,
            errorMsg: errors.array()[0].msg,
        validationErrors:errors.array()});
    }
    req.user
      .createProduct({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
    })
        .then(result=>{
            console.log("Created Product!");
            res.redirect("/admin/products");
        })
        .catch(err=>console.log(err));
};
export const getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product=>{
            if(!product) {
                return res.redirect("/");
            }
            // check if u can edit proudct or not
            if(product.userId !== req.user.id){
                req.flash("error","this product doesn't belong to you therefore u can't edit it.")
                return res.redirect("/");
            }
            res.render("admin/edit-product",{
                    pageTitle:"Edit Product",
                    path:"/admin/edit-product",
                    editing:true,
                    product:product,
                    isAuth:req.session.isLoggedIn,
                    hasError:false,
                    errorMsg:null,
                    validationErrors:[]});
        })
        .catch(err=>console.log(err));
};
export const postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render("admin/edit-product",{
            pageTitle:"Edit Product",
            path:"/admin/edit-product/",
            editing:true,
            hasError:true,
            product:{
                id:prodId,
                title:updatedTitle,
                imageUrl:updatedImageUrl,
                price:updatedPrice,
                description:updatedDescription
            },
            isAuth:req.session.isLoggedIn,
            errorMsg: errors.array()[0].msg,
            validationErrors:errors.array()
            });
    }
    Product.findByPk(prodId)
        .then(product=>{
            //check if u can edit product or not
            if(product.userId !== req.user.id){
                req.flash("error","this product doesn't belong to you therefore u can't edit it.");
                return res.redirect("/");
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result=>{
            if(result){
                console.log("UPDATED PRODUCT");
                res.redirect("/admin/products");
            }
        })
        .catch(err=>console.log(err));
};
export const getAdminProducts = (req,res,next)=>{
    // req.user
    //     .getProducts()
    // another way:
    Product.findAll({where:{userId:req.user.id}})
        .then(products=>{
            res.render("admin/products"
                ,{prods: products,pageTitle:"Admin Products"
                    ,path:"/admin/products",
                    isAuth:req.session.isLoggedIn});
        })
        .catch(err=>console.log(err));
};
export const postDeleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    // Product.destroy({})
    Product.findByPk(prodId)
        .then(product=>{
            if(product.userId !== req.user.id){
                req.flash("error","this product doesn't belong to you therefore u can't delete it.")
                return res.redirect("/");
            }
            return product.destroy();
        })
        .then(result=>{
            if(result){
                console.log("DESTROYED PRODUCT");
                res.redirect("/admin/products");
            }
        })
        .catch(err=>console.log(err));
};