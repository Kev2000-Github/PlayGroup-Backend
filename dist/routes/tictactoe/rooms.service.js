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
exports.removeRoom = exports.addPlayerToRoom = exports.getRoom = exports.getRooms = exports.createRoom = void 0;
const Room = require("../../database/models/Room");
const createRoom = (roomId, { uuid, turn, nickname }) => __awaiter(void 0, void 0, void 0, function* () {
    const roomExists = yield Room.findOne({ roomId });
    if (roomExists)
        return null;
    const playerTwo = { uuid: "", nickname: "", turn: false };
    const play = { roomId, playerHost: { uuid, turn, nickname }, playerTwo };
    const newRoom = new Room(play);
    yield newRoom.save();
    return play;
});
exports.createRoom = createRoom;
const getRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield Room.find({});
    return rooms;
});
exports.getRooms = getRooms;
const getRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield Room.findOne({ roomId });
    return room;
});
exports.getRoom = getRoom;
const addPlayerToRoom = (roomId, { uuid, turn, nickname }) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield Room.findOneAndUpdate({ roomId }, { playerTwo: { uuid, turn, nickname } });
    console.log(roomId);
    return room;
});
exports.addPlayerToRoom = addPlayerToRoom;
const removeRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield Room.findOneAndDelete({ roomId });
    return room;
});
exports.removeRoom = removeRoom;
