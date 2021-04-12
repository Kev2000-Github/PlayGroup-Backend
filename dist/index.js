"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app_1 = require("./routes/app");
const compression_1 = __importDefault(require("compression"));
const config_1 = require("./config/config");
const corsConfig_1 = require("./config/corsConfig");
const handleSockets_1 = require("./routes/webSockets/handleSockets");
const http_1 = __importDefault(require("http"));
require('./database/database');
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = require('socket.io')(server, {
    cors: corsConfig_1.corsConfig
});
//SET CONFIGURATION
app.set("PORT", process.env.PORT || 3000);
//USE MIDDLEWARES
if (config_1.config.mode === "development") {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}
app.use(cors_1.default(corsConfig_1.corsConfig));
app.use(compression_1.default());
app.use(express_1.default.json());
app.use("/", app_1.router);
handleSockets_1.handleSocket(io);
//SERVER
server.listen(app.get("PORT"), () => {
    console.log(`server is up on port ${app.get("PORT")}`);
});
