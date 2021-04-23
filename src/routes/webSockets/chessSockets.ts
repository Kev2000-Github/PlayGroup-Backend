import socketIO from "socket.io";
import { addRetryRequest, clearRetryRequests, getRoom, removePlayer, removeRoom, updateGrid } from '../rooms/chess/chess.service';
import { config } from "../../config/config";
import { checkAvailablePromotion, move, setupChessBoard } from "../../utils/utils";

export const chessSocket = (io: socketIO.Server) => {
    io.of("/chess")
        .on("connection", socket => {
            console.log("connecting...", socket.rooms);

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

            socket.on("movePiece", async (roomId, userId, { from, to }, callback) => {
                const room = await getRoom(roomId);
                if (!room) return callback("Error, Room does not exists");
                const updatedChessBoard = move(from, to, room.grid);
                const update = await updateGrid(roomId, updatedChessBoard);
                if (!update) return callback("Error, cannot update chessBoard state");
                socket.emit("movePiece", { unlockRival: userId, chessBoard: updatedChessBoard });
                socket.to(roomId).emit("movePiece", { unlockRival: userId, chessBoard: updatedChessBoard });
                if (Math.abs(to.square.value) === 6) {
                    socket.emit("conclusion", "You Win!");
                    socket.to(roomId).emit("conclusion", "You Lose");
                    callback();
                    return;
                }
                const promotion = checkAvailablePromotion(updatedChessBoard);
                if (promotion) {
                    const promotionPawn = {
                        pos: to.square.pos,
                        piece: to.square.value,
                        idx: to.idx
                    };
                    socket.emit("promotion", { promote: true, promotionPawn });
                    socket.to(roomId).emit("promotion", { promote: false });
                }
                callback();
            })

            socket.on("giveup", ({ roomId, username }) => {
                socket.emit("conclusion", "You Lose");
                socket.to(roomId).emit("conclusion", "You Win!");
                socket.to(roomId).emit("alert", `${username} gave up`);
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
                    await updateGrid(roomId, setupChessBoard());
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