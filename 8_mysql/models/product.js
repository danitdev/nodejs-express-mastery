import crypto from "crypto";
import { json } from "body-parser";
import { Cart } from "./cart.js";
import { poolPromise as db } from "../utils/database.js";


class Product{
    constructor(id,title,imageUrl,description,price)
    {
        // adding random UUID using crypto
        this.id = id || crypto.randomUUID();
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save()
    {
        return db.execute("INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)",[this.title,this.price,this.description,this.imageUrl]);
    }    
    static deleteById(id)
    {
        
    }
    static fetchAll()
    {
       return db.execute("SELECT * FROM products");
    }
    static findById(id)
    {
        return db.execute("SELECT * FROM products WHERE products.id = ?",[id]);
    }
}
export{Product};