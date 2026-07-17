import express from "express";
const app = express();


// app.use((req,res,next)=>{
//     console.log("first middleware!");
//     next();
// });
// app.use((req,res,next)=>{
//     console.log("second middleware!");
//     res.send("<h1>the response</h1>");
// });
app.use("/users",(req,res,next)=>{
    res.send(`
        <ul>
            <li>user 1</li>
            <li>user 2</li>
            <li>user 3</li>
            <li>user 4</li>
            <li>user 5</li>
        </ul>`)
});
app.use("/",(req,res,next)=>{
    res.send("<h1>other than the /users</h1>");
});


app.listen(3000);