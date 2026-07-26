import { Product } from "../models/product.js";


export const getProducts = (req,res,next)=>{
    const products = Product.fetchAll((products)=>{
        res.render("shop/product-list",{prods: products,pageTitle:"Shop",path:"/products"});
    });
};
export const getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    console.log(prodId);
    res.redirect("/");
}
export const getIndex = (req,res,next)=>{
    const products = Product.fetchAll((products)=>{
        res.render("shop/index",{prods: products,pageTitle:"All Products",path:"/"});
    });
}
export const getCart = (req,res,next)=>{
    res.render("shop/cart",{path:"/cart",pageTitle:"Your Cart"})
}
export const getCheckout = (req,res,next)=>{
    res.render("shop/checkout",{path:"/checkout",pageTitle:"Checkout"})
}
export const getOrders = (req,res,next)=>{
    res.render("shop/orders",{path:"/orders",pageTitle:"Orders"})
}
