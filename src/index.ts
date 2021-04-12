import express from 'express';
import cors from 'cors';
import { router } from "./routes/app";
import compression from "compression";
import { config } from "./config/config";
import { corsConfig } from "./config/corsConfig";
import { handleSocket } from "./routes/webSockets/handleSockets";
import http from 'http';
import socketIO from 'socket.io';
require('./database/database');

const app = express();
const server = http.createServer(app);
const io: socketIO.Server = require('socket.io')(server, {
    cors: corsConfig
});
//SET CONFIGURATION
app.set("PORT", process.env.PORT || 3000);

//USE MIDDLEWARES
if (config.mode === "development") {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}
app.use(cors(corsConfig));
app.use(compression());
app.use(express.json());
app.use("/", router);
handleSocket(io);

//SERVER
server.listen(app.get("PORT"), () => {
    console.log(`server is up on port ${app.get("PORT")}`);
})