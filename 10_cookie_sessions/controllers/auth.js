export const getLogin = (req,res,next)=>{
    const isLoggedIn = req.get("Cookie").split("=")[1];
    console.log(isLoggedIn);
    res.render("auth/login",{path:"/login",pageTitle:"login",isAuth:isLoggedIn});
};
export const postLogin = (req,res,next)=>{
    // setting a cookie
    res.setHeader("Set-Cookie","loggedIn=true");
    res.redirect("/");
}