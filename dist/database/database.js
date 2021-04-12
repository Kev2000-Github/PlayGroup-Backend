"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const URI = process.env.URI || "mongodb://localhost/tictactoeDB";
mongoose_1.default.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log("the database is up and working"))
    .catch((err) => console.log(err));
module.exports = mongoose_1.default;
