import fs from "fs";
import path from "path";
import rootDir from "./path.js";
export const deleteFile = (filePath)=>{
    const pathImages = path.join(rootDir, filePath);
    fs.unlink(pathImages,(err)=>{
        if(err){
            throw (err);
        }
        console.log(`Deleted file on path: ${pathImages}`)
    })
}