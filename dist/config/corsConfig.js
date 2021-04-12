"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const frontURL = process.env.FRONT_URL || "localhost";
exports.corsConfig = {
    origin: [new RegExp(frontURL)],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};
