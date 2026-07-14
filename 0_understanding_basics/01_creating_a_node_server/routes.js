import * as fs from "fs";
const reqHandeler = (req,res)=>{
    const url = req.url;
    const method = req.method;
    if(url==="/"){
    res.setHeader("Content-Type","text/html");
    res.write("<html>");
    res.write("<head><title>Enter message:</title></head>");
    res.write("<body><form action='/msgShow' method='POST'><input type='text' name='msg'><button type='submit'>Send</button></form></body>")
    res.write("</html>");
    return res.end(); 
    }
    if(url==="/msgShow"&&method ==="POST"){
    const body = [];
    req.on("data",(chunck)=>{
        console.log(chunck);
        body.push(chunck);
    });
    return req.on("end",()=>{
        const parsedBody = Buffer.concat(body).toString();
        const message = parsedBody.split("=")[1];
        fs.writeFile("message.txt",message,(err)=>{
            res.statusCode = 302;
            res.setHeader("Location","/");
            return res.end();
        });

    });
    }
    res.setHeader("Content-Type","text/html");
    res.write("<html>");
    res.write("<head><title>My first page</title></head>");
    res.write("<body><h1>hello from my node.js server!</h1></body>")
    res.write("</html>");
    res.end(); 
    // after writing all data we have to res.end
    // after we get the req it exit
}

// export default reqHandeler;
export {reqHandeler};