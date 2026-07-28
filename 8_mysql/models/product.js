import crypto from "crypto";
import { json } from "body-parser";
import { Cart } from "./cart.js";
import { poolPromise as db } from "../utils/database.js";


class Product{
    constructor(id,title,imageUrl,desc,price)
    {
        // adding random UUID using crypto
        this.id = id || crypto.randomUUID();
        this.title = title;
        this.imageUrl = imageUrl;
        this.desc = desc;
        this.price = price;
    }
    save()
    {
        
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
    
    }
}
export{Product};