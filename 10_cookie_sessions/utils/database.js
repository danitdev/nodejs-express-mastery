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
export const sequelize = new Sequelize("node-complete","root","REMOVED",{dialect:"mysql",host:"localhost"});
