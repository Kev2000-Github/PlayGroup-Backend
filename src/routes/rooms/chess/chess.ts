import { Router } from 'express';
import { createRoom, addPlayerToRoom, removeRoom, getRooms, getRoom } from "./chess.service";
import { createRoomRules, addPlayerToRoomRules } from "./chessRules";
import { endpoints } from "../../../utils/constants/endpoints";
import { handleAsyncError } from "../../../middleware/handleAsyncError";
import { validate } from "../../../middleware/validate";
import { setupChessBoard } from "../../../utils/utils";
const router = Router();

router.post(endpoints.chess.CREATE_ROOM, createRoomRules, validate, handleAsyncError(async (req, res) => {
    const { roomId } = req.body;
    const { uuid, nickname } = req.body.player;
    let grid: Array<{ value: number; pos: string; }> = [];
    grid = setupChessBoard();
    const room = await createRoom(roomId, { uuid, nickname, turn: uuid }, grid);
    res.json({ ...room });
}))

router.get(endpoints.chess.GET_ROOMS, handleAsyncError(async (req, res) => {
    const rooms = await getRooms();
    res.json({ rooms });
}))

router.get(endpoints.chess.GET_ROOM, handleAsyncError(async (req, res) => {
    const roomId = req.params.roomId;
    const rooms = await getRoom(roomId);
    res.json({ rooms });
}))

router.put(endpoints.chess.ADD_PLAYER_TO_ROOM, addPlayerToRoomRules, validate, handleAsyncError(async (req, res) => {
    const { roomId } = req.body;
    const { uuid, nickname } = req.body.player;
    const room = await addPlayerToRoom(roomId, { uuid, nickname });
    res.json({ ...room['_doc'] })
}))

router.delete(endpoints.chess.REMOVE_ROOM, handleAsyncError(async (req, res) => {
    const roomId = req.params.roomId;
    const roomDeleted = await removeRoom(roomId);
    res.json({ roomDeleted });
}))

export { router as chessRouter };