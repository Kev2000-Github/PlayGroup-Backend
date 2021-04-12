"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env = (process.env.NODE_ENV || "development").trim();
if (env === "development") {
    require('dotenv').config();
}
exports.config = {
    mode: env,
};
