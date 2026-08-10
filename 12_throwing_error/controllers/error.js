export const throw404 = (req,res,next)=>{
    res.status(404).render("404",{pageTitle:"Page Not Found",path:""});
};
export const throw500 = (req,res,next)=>{
    res.status(500).render("500",{pageTitle:"Error!",path:"/500"});
};