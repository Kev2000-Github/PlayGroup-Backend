"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRouter = void 0;
const express_1 = require("express");
const rooms_service_1 = require("./rooms.service");
const router = express_1.Router();
exports.roomRouter = router;
/**
 * @Body
 * roomId: string
 * playerHost: @PlayerHost
 * @PlayerHost
 * uuid: string
 * nickname: string
 * turn: boolean
 *
*/
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, playerHost } = req.body;
    const room = yield rooms_service_1.createRoom(roomId, Object.assign(Object.assign({}, playerHost), { turn: false }));
    res.json(Object.assign({}, room));
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield rooms_service_1.getRooms();
    res.json({ rooms });
}));
router.get("/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = req.params.roomId;
    const rooms = yield rooms_service_1.getRoom(roomId);
    res.json({ rooms });
}));
router.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { player, roomId } = req.body;
    const room = yield rooms_service_1.addPlayerToRoom(roomId, Object.assign(Object.assign({}, player), { turn: false }));
    res.json(Object.assign({}, room['_doc']));
}));
