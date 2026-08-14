import fs from "fs";
import path from "path";
import rootDir from "../utils/path.js";
import PDFDocument from "pdfkit";


import { Product } from "../models/product.js";
import { Cart } from "../models/cart.js";
import {Order} from "../models/order.js";

const ITEM_PER_PAGE = 2;

export const getProducts = (req,res,next)=>{
    // find all is fetching the all from table
    Product.findAll()
        .then(products=>{
            res.render("shop/product-list",{prods: products,pageTitle:"All Products",path:"/products"});
        })
        .catch(err=>{
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
export const getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
        //alternative way using findAll and filter it 
    // Product.findAll({where:{id:prodId}}).then(products=>{
        // res.render("shop/product-detail",{product:products[0],pageTitle:products[0].title,path:"/products"});
    // }).catch(err=>console.log(err));
    // find by pk is for fetching one from table using id
    Product.findByPk(prodId)
        .then((product)=>{          
            res.render("shop/product-detail",{product:product,pageTitle:product.title,path:"/products"});
        })
        .catch(err=>{
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
export const getIndex = (req,res,next)=>{
    const page = +req.query.page||1;
    const offset = (page-1)*ITEM_PER_PAGE;
    let message = req.flash("error");
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    Product.findAll({limit:ITEM_PER_PAGE,offset:offset}).then(products=>{
        res.render("shop/index",{prods: products,pageTitle:"All Products",path:"/",errorMsg:message});
    })
    .catch(err=>{
        const error =  new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
export const getCart = (req,res,next)=>{
    req.user.getCart()
        .then(cart=>{
            return cart.getProducts()
                .then(products=>{
                    res.render("shop/cart",{path:"/cart",pageTitle:"Your Cart",products:products})
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
};
export const postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart=>{
            fetchedCart = cart;
            return cart.getProducts({where:{id:prodId}})
        })
        .then(products=>{
            let product;
            if(products.length > 0){
                product = products[0];
            }
            console.log(product);
            if(product){
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity+1;
                return product;
            }
            return Product.findByPk(prodId)
        })
        .then(product=>{
            return fetchedCart.addProduct(product,{through:{quantity:newQuantity}});
        })
        .then(()=>{
            res.redirect("/cart");
        })
        .catch(err=>{
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
export const postCartDeleteProduct =(req,res,next)=>{
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart=>{
            return cart.getProducts({where:{id: prodId}});
        })
        .then(products=>{
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result=>{
            res.redirect("/cart");
            console.log("Product deleted from Cart!");
        })
        .catch(err=>{
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
export const postOrder = (req,res,next)=>{
    let fetchedCart;
    req.user.getCart()
        .then(cart=>{
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products=>{
            return req.user.createOrder()
                .then(order=>{
                    return order.addProducts(products.map(product=>{
                        product.orderItem = {quantity: product.cartItem.quantity};
                        return product;
                    
                    }));
                })
                .catch(err=>{
                    const error =  new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .then(result=>{
            return fetchedCart.setProducts(null);
        })
        .then(result=>{
            res.redirect("/orders");
        })
        .catch(err=>{
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
export const getCheckout = (req,res,next)=>{
    res.render("shop/checkout",{path:"/checkout",pageTitle:"Checkout"})
};
export const getOrders = (req,res,next)=>{
    req.user.getOrders({include:['products']})
        .then(orders=>{
            res.render("shop/orders",{path:"/orders",pageTitle:"Orders",orders:orders})
        })
        .catch(err=>{
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


export const getInvoice = (req,res,next)=>{
    const orderId = req.params.orderId;
    const invoiceName = "invoice-"+orderId+".pdf";
    const invoicePath = path.join("data","invoices",invoiceName);
    Order.findByPk(orderId)
        .then(order=>{
            if(!order){
                return next(new Error("No order found."));
            }
            if(order.userId !== req.user.id){
                return next(new Error("Unauthorized"));
            }
            // fs.readFile(invoicePath,(err,data)=>{
            //     if(err){
            //         return next(err);
            //     }
            //     res.setHeader("Content-Type","application/pdf");
            //     // res.setHeader("Content-Disposition","inline");
            //     //setting the file type header so it downloads the file
            //     res.setHeader("Content-Disposition",`attachment; filename=${invoiceName}`);
            //     res.send(data);
            // });
            const file = fs.createReadStream(invoicePath);
            res.setHeader("Content-Type","application/pdf");
            res.setHeader("Content-Disposition",`attachment; filename=${invoiceName}`);
            //pipe the chunks of the files to respond cuz of it is writeable
            file.pipe(res);
        })
        .catch(err=>console.log(err));
    //streaming better practice then load the data in memory
      

};

export const generateInvoice = (req,res,next)=>{
    const orderId = req.params.orderId;
    const invoiceName = "invoice"+".pdf";
    const invoicePath = path.join("data","invoices",invoiceName);
    Order.findByPk(orderId,{include:Product})
        .then(order=>{
            if(!order){
                return next(new Error("No order found."));
            }
            if(order.userId !== req.user.id){
                return next(new Error("Unauthorized"));
            }
            const pdfDoc = new PDFDocument();
            res.setHeader("Content-Type","application/pdf");
            res.setHeader("Content-Disposition",`attachment; filename=${invoiceName}`);
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize(26).text("Invoice",{underline:true});
            let totalPrice = 0;
            order.products.forEach(product=>{
                pdfDoc.fontSize(14).text(product.title+"-"+product.orderItem.quantity+"x"+"$"+product.price+"="+(product.price*product.orderItem.quantity).toString())
                totalPrice += product.price*product.orderItem.quantity;
            });
            pdfDoc.text("--------------------");
            pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);
            pdfDoc.end();
        })
        .catch();
};
export const generateInvoiceV2 = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join("data", "invoices", invoiceName);
    Order.findByPk(orderId, { include: Product })
        .then(order => {
            if (!order) {
                return next(new Error("No order found."));
            }
            if (order.userId !== req.user.id) {
                return next(new Error("Unauthorized"));
            }
            const pdfDoc = new PDFDocument({
                size: "A4",
                margin: 50
            });
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${invoiceName}"`
            );
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc
                .fontSize(28)
                .font("Helvetica-Bold")
                .text("INVOICE");
            pdfDoc
                .fontSize(10)
                .font("Helvetica")
                .fillColor("gray")
                .text(`Invoice #${orderId}`)
                .text(`Date: ${new Date().toLocaleDateString()}`);
            pdfDoc.moveDown(2);
            pdfDoc
                .strokeColor("#cccccc")
                .moveTo(50, pdfDoc.y)
                .lineTo(545, pdfDoc.y)
                .stroke();
            pdfDoc.moveDown(1);
            pdfDoc
                .fillColor("black")
                .fontSize(14)
                .font("Helvetica-Bold")
                .text("Bill To");
            pdfDoc
                .fontSize(11)
                .font("Helvetica")
                .text(req.user.email);
            pdfDoc.moveDown(2);
            const tableTop = pdfDoc.y;
            pdfDoc
                .font("Helvetica-Bold")
                .fontSize(11)
                .text("Product", 50, tableTop)
                .text("Qty", 330, tableTop)
                .text("Price", 390, tableTop)
                .text("Total", 470, tableTop);
            pdfDoc
                .strokeColor("#aaaaaa")
                .moveTo(50, tableTop + 18)
                .lineTo(545, tableTop + 18)
                .stroke();
            let totalPrice = 0;
            order.products.forEach(product => {
                const quantity = product.orderItem.quantity;
                const price = Number(product.price);
                const productTotal = price * quantity;
                totalPrice += productTotal;
                pdfDoc.moveDown(1);
                const y = pdfDoc.y;
                pdfDoc
                    .font("Helvetica")
                    .fontSize(10)
                    .fillColor("black")
                    .text(product.title, 50, y, {
                        width: 260
                    })
                    .text(quantity.toString(), 330, y)
                    .text(`$${price.toFixed(2)}`, 390, y)
                    .text(`$${productTotal.toFixed(2)}`, 470, y);
                pdfDoc
                    .strokeColor("#eeeeee")
                    .moveTo(50, y + 20)
                    .lineTo(545, y + 20)
                    .stroke();
            });
            pdfDoc.moveDown(2);
            pdfDoc
                .font("Helvetica-Bold")
                .fontSize(16)
                .text(
                    `Total: $${totalPrice.toFixed(2)}`,
                    350,
                    pdfDoc.y,
                    {
                        width: 195,
                        align: "right"
                    }
                );
            pdfDoc
                .font("Helvetica")
                .fontSize(9)
                .fillColor("gray")
                .text(
                    "Thank you for your purchase!",
                    50,
                    750,
                    {
                        align: "center",
                        width: 495
                    }
                );
            pdfDoc.end();
        })
        .catch(err => {
            next(err);
        });
};