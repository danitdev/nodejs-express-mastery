import * as mysql from "mysql2";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database:"node-complete",
    password:"REMOVED"
});

export const poolPromise = pool.promise();