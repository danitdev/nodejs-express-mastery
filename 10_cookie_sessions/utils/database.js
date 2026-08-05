// import * as mysql from "mysql2";

// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     database:"node-complete",
//     password:"REMOVED"
// });

// export const poolPromise = pool.promise();

//using orm instead of that pool promise we have 
//now orm handles connection and stuff
import {Sequelize} from "sequelize";
import "dotenv/config";
export const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{dialect:process.env.DB_DIALECT,host:process.env.DB_HOST});
