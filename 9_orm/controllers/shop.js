import { Product } from "../models/product.js";
import { Cart } from "../models/cart.js";

export const getProducts = (req,res,next)=>{
    // find all is fetching the all from table
    Product.findAll().then(products=>{
        res.render("shop/index",{prods: products,pageTitle:"All Products",path:"/products"});
    }).catch(err=>console.log(err));
};
export const getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([rows,fieldData])=>{
            const product = rows[0];
            res.render("shop/product-detail",{product:product,pageTitle:product.title,path:"/products"})
            console.log("poplo???");
        })
        .catch(err=>{console.log(err)})
};
export const getIndex = (req,res,next)=>{
    Product.findAll().then(products=>{
        res.render("shop/index",{prods: products,pageTitle:"All Products",path:"/"});
    }).catch(err=>console.log(err));
};
export const getCart = (req,res,next)=>{
    Cart.getCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts = [];
            for(const product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData){
                    cartProducts.push({productData: product,qty: cartProductData.qty});
                }
            }
            res.render("shop/cart",{path:"/cart",pageTitle:"Your Cart",products:cartProducts})
        });
    });

};
export const postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId,(product)=>{
        Cart.addProduct(prodId,product.price);
    })
    res.redirect("/cart");
};
export const postCartDeleteProduct =(req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId,product=>{
        Cart.deleteProduct(prodId,product.price);
        res.redirect("/cart");
    })
};
export const getCheckout = (req,res,next)=>{
    res.render("shop/checkout",{path:"/checkout",pageTitle:"Checkout"})
};
export const getOrders = (req,res,next)=>{
    res.render("shop/orders",{path:"/orders",pageTitle:"Orders"})
};
