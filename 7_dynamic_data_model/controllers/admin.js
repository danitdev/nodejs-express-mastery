import { Product } from "../models/product.js";

export const getAddProduct = (req,res,next)=>{
    res.render("admin/edit-product",{pageTitle:"Add Product",path:"/admin/add-product",editing:false});
};

export const postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const desc = req.body.desc;
    const price = req.body.price;
    const product = new Product(null,title,imageUrl,desc,price);
    product.save();
    res.redirect("/");
};
export const getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId,product =>{
        if(!product){
            return res.redirect("/");
        }
        console.log(product);
        res.render("admin/edit-product",{
                pageTitle:"Edit Product",
                path:"/admin/edit-product",
                editing:true,
                product:product});
        
    });
};
export const postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.desc;
    const updatedProd = new Product(prodId,updatedTitle,updatedImageUrl,updatedDesc,updatedPrice);
    updatedProd.save();
    res.redirect("/admin/products");
};
export const getAdminProducts = (req,res,next)=>{
    const products = Product.fetchAll((products)=>{
        res.render("admin/products"
            ,{prods: products,pageTitle:"Admin Products"
                ,path:"/admin/products"});
    });
};