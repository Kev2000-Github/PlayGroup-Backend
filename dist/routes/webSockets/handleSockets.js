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
exports.handleSocket = void 0;
const rooms_service_1 = require("../tictactoe/rooms.service");
const utils_1 = require("../../utils/utils");
const handleSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("connecting... ", socket.rooms);
        socket.on("join", ({ roomId, userId }, callback) => __awaiter(void 0, void 0, void 0, function* () {
            const newRoom = yield rooms_service_1.getRoom(roomId);
            if (!newRoom)
                return callback("Error, Room does not exists");
            const playerTwoID = newRoom.playerTwo.uuid;
            socket.join([newRoom.roomId, userId]);
            if (playerTwoID == "") {
                return callback("-1");
            }
            else {
                socket.to(roomId).emit("playerTwo_joined", { uuid: playerTwoID });
                return callback("1");
            }
        }));
        socket.on("set_play", ({ grid, roomId, playerId }, callback) => __awaiter(void 0, void 0, void 0, function* () {
            socket.to(roomId).emit("set_play", { grid });
            const result = utils_1.tictactoe(grid);
            console.log(result);
            if (result) {
                console.log("FINISHED");
                const room = yield rooms_service_1.getRoom(roomId);
                const rivalPlayerId = playerId === room.playerHost.uuid ? room.playerTwo.uuid : room.playerHost.uuid;
                socket.to(rivalPlayerId).emit("conclusion", "You Lose");
                callback("You Win!");
            }
            else if (result === null) {
                socket.to(roomId).emit("conclusion", "Draw");
                callback("Draw");
            }
        }));
        socket.on("leave", ({ roomId }) => {
            socket.leave(roomId);
            socket.to(roomId).emit("leave");
        });
        socket.on('disconnecting', () => {
            console.log('disconecting...', socket.rooms);
            const roomId = Array.from(socket.rooms).filter(roomUUID => /R-/.test(roomUUID));
            socket.leave(roomId[0]);
            socket.to(roomId[0]).emit("player disconnected");
        });
    });
};
exports.handleSocket = handleSocket;
