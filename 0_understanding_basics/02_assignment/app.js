import * as http from "http";
import { handelReq } from "./routes";
const server = http.createServer(handelReq);
server.listen(3000);