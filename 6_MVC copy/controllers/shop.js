import { Product } from "../models/product.js";


export const getShop = (req,res,next)=>{
    const products = Product.fetchAll((products)=>{
        res.render("shop/product-list",{prods: products,pageTitle:"Shop",path:"/"});
    });
};
export const getIndex = (req,res,next)=>{
    const products = Product.fetchAll((products)=>{
        res.render("shop/index",{prods: products,pageTitle:"All Products",path:"/products"});
    });
}
export const getCart = (req,res,next)=>{
    res.render("shop/cart",{path:"/cart",pageTitle:"Your Cart"})
}
export const getCheckout = (req,res,next)=>{
    res.render("shop/checkout",{path:"/checkout",pageTitle:"Checkout"})
}