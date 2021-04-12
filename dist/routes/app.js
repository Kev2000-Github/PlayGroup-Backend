"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const tictactoe_1 = require("./tictactoe/tictactoe");
const rooms_1 = require("./tictactoe/rooms");
const router = express_1.Router();
exports.router = router;
router.use("/", tictactoe_1.tictactoeRouter);
router.use("/rooms", rooms_1.roomRouter);
