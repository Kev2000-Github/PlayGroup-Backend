import socketIO from 'socket.io';
import { addRetryRequest, clearRetryRequests, getRoom, removePlayer, removeRoom, updateGrid } from '../rooms/tictactoe/tictactoe.service';
import { processTicTacToeMatrix, playTicTacToe } from "../../utils/utils";
import { config } from "../../config/config";

export const tictactoeSocket = (io: socketIO.Server) => {
    io.of("/tictactoe")
        .on("connection", (socket) => {
            console.log("connecting... ", socket.rooms);

            socket.on("join", async ({ roomId, user }, callback) => {
                const newRoom = await getRoom(roomId);
                if (!newRoom) return callback("Error, Room does not exists");
                socket.join([newRoom.roomId, user.uuid]);
                if (newRoom.players.length <= 1) {
                    return callback("-1");
                }
                else {
                    const userInfo = {
                        uuid: user.uuid,
                        nickname: user.nickname,
                        profilePhoto: user.profilePhoto
                    }
                    socket.to(roomId).emit("playerTwo_joined", { ...userInfo });
                    return callback("1")
                }
            });

            socket.on("send_rival_info", async ({ roomId, user }) => {
                socket.to(roomId).emit("send_rival_info", { ...user });
            })

            socket.on("set_play", async ({ play, roomId, playerId }, callback) => {
                const room = await getRoom(roomId);
                const playerValue = room.players.filter(player => player.uuid === playerId);
                const gridUpdated = playTicTacToe(play, room.grid, playerValue[0].value);
                const result = processTicTacToeMatrix(gridUpdated);

                await updateGrid(roomId, result);

                socket.in(roomId).emit("set_play", { grid: result, unlockUserId: playerId });
                socket.emit("set_play", { grid: result, unlockUserId: playerId });
                if (result?.includes(10) || result?.includes(-10)) {
                    socket.to(roomId).emit("conclusion", "You Lose");
                    callback("You Win!");
                }
                else if (!result.includes(0)) {
                    socket.to(roomId).emit("conclusion", "Draw");
                    callback("Draw");
                }
                callback();
            })

            socket.on("leave", async ({ roomId, uuid }) => {
                socket.leave(roomId);
                socket.to(roomId).emit("leave");
                const room = await removePlayer(roomId, uuid);
                if (room.players.length <= 0) await removeRoom(roomId);
            })

            socket.on("retry", async ({ roomId, playerId }, callback) => {
                const room = await getRoom(roomId);
                const matchedPlayer = room.players.filter(player => player.uuid === playerId);
                if (matchedPlayer.length < 1 || room.retry.includes(playerId)) return;
                const retryRoom = await addRetryRequest(roomId, playerId);
                callback("retry registered");
                if (retryRoom.retry.length >= 2) {
                    await updateGrid(roomId, Array(9).fill(0));
                    socket.in(roomId).emit("retry", { uuid: playerId });
                    socket.emit("retry", { uuid: playerId });
                    await clearRetryRequests(roomId);
                }
            })

            socket.on('disconnecting', async () => {
                console.log('disconecting...', socket.rooms);
                const roomIds = Array.from(socket.rooms).filter(roomUUID => /R-/.test(roomUUID));
                const playerId = Array.from(socket.rooms).filter(playerUUID => config.uuid.test(playerUUID));
                await Promise.all(roomIds.map(async roomId => {
                    socket.to(roomId).emit("player disconnected");
                    if (playerId.length > 0) {
                        const room = await removePlayer(roomId, playerId[0]);
                        if (room.players.length <= 0) await removeRoom(roomId);
                    }
                }))
            })
        })
}