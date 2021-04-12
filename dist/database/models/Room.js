"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const Room = new Schema({
    roomId: { type: String, required: true, unique: true, dropDups: true },
    playerHost: {
        uuid: { type: String },
        nickname: { type: String },
        turn: { type: Boolean }
    },
    playerTwo: {
        uuid: { type: String },
        nickname: { type: String },
        turn: { type: Boolean }
    }
});
module.exports = mongoose_1.default.model('Room', Room);
