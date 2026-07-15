const handelReq = (req,res)=>{
    const url = req.url;
    const method = req.method;
    const users = [];
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
}

export{handelReq};