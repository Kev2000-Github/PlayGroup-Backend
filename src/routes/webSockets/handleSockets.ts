import socketIO from 'socket.io';
import { getRoom } from '../tictactoe/rooms.service';
import { tictactoe } from "../../utils/utils";

export const handleSocket = (io: socketIO.Server) => {
    io.on("connection", (socket) => {
        console.log("connecting... ", socket.rooms);
        socket.on("join", async ({ roomId, userId }, callback) => {
            const newRoom = await getRoom(roomId);
            if (!newRoom) return callback("Error, Room does not exists");
            const playerTwoID = newRoom.playerTwo.uuid
            socket.join([newRoom.roomId, userId]);
            if (playerTwoID == "") {
                return callback("-1");
            }
            else {
                socket.to(roomId).emit("playerTwo_joined", { uuid: playerTwoID });
                return callback("1")
            }
        });

        socket.on("set_play", async ({ grid, roomId, playerId }, callback) => {
            socket.to(roomId).emit("set_play", { grid });
            const result = tictactoe(grid);
            if (result) {
                console.log("FINISHED")
                const room = await getRoom(roomId);
                const rivalPlayerId = playerId === room.playerHost.uuid ? room.playerTwo.uuid : room.playerHost.uuid;
                socket.to(rivalPlayerId).emit("conclusion", "You Lose");
                callback("You Win!");
            }
            else if (result === null) {
                socket.to(roomId).emit("conclusion", "Draw");
                callback("Draw");
            }
        })

        socket.on("leave", ({ roomId }) => {
            socket.leave(roomId);
            socket.to(roomId).emit("leave");
        })

        socket.on('disconnecting', () => {
            console.log('disconecting...', socket.rooms);
            const roomId = Array.from(socket.rooms).filter(roomUUID => /R-/.test(roomUUID));
            socket.leave(roomId[0]);
            socket.to(roomId[0]).emit("player disconnected");
        })
    })
}