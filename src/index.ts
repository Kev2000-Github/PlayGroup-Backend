import express from 'express';
import cors from 'cors';
import { router } from "./routes/app";
import compression from "compression";
import { config } from "./config/config";
import { corsConfig } from "./config/corsConfig";
import { tictactoeSocket } from "./routes/webSockets/tictactoeSockets";
import http from 'http';
import socketIO from 'socket.io';
import { chessSocket } from './routes/webSockets/chessSockets';
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
tictactoeSocket(io);
chessSocket(io);

//SERVER
server.listen(app.get("PORT"), () => {
    console.log(`server is up on port ${app.get("PORT")}`);
})