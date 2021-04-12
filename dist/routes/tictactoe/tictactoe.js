"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tictactoeRouter = void 0;
const express_1 = require("express");
const router = express_1.Router();
exports.tictactoeRouter = router;
router.get("/", (req, res) => {
    res.send("HELLO WORLD");
});
