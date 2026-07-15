import * as http from "http";
import { handelReq } from "./routes.js";
const server = http.createServer((req,res)=>{
    const url = req.url;
    const method = req.method;
    if (url === "/" && method === "GET"){
        res.setHeader("Content-Type","text/html");
        res.write(`
        <html>
            <head><title>Hello Dude</title></head>
            <body>
                <h1>hello from my node.js server!</h1>
                <h2>make some user with the input below :D</h2>
                <form action='/create-user' method='POST'><input type='text' name='createUser'><button type='submit'>Send</button></form>
            </body>
        </html>  
            `);
        res.end();
    }
   else if(url==="/users"&& method ==="GET"){
        res.setHeader("Content-Type","text/html");
        res.write(`
    <html>
        <body>
            <ul>
                <li>User 1</li>
                <li>User 2</li>
                <li>User 3</li>
                <li>User 4</li>
                <li>User 5</li>
                <li>User 6</li>
                <li>User 7</li>
                <li>User 8</li>
                <li>User 9</li>
                <li>User 10</li>
            </ul>
        </body>
    </html>
`);
res.end();
    }
    else if(url==="/create-user" && method === "POST"){
        const body = [];
        req.on("data",(chunck)=>{
            body.push(chunck);
        });
        req.on("end",()=>{
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split("=")[1];
            console.log(username);
            res.statusCode = 302;
            res.setHeader("Location","/");
            res.end();
        });
    }

});
server.listen(3000);