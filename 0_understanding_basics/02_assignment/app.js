import * as http from "http";
import { handelReq } from "./routes.js";
const server = http.createServer(handelReq);
server.listen(3000);