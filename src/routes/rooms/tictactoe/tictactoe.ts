import { Router } from 'express';
import { createRoom, addPlayerToRoom, removeRoom, getRooms, getRoom } from "./tictactoe.service";
import { createRoomRules, addPlayerToRoomRules } from "./tictactoeRules";
import { endpoints } from "../../../utils/constants/endpoints";
import { handleAsyncError } from "../../../middleware/handleAsyncError";
import { validate } from "../../../middleware/validate";
const router = Router();

router.post(endpoints.tictactoe.CREATE_ROOM, createRoomRules, validate, handleAsyncError(async (req, res) => {
    const { roomId } = req.body;
    const { uuid, nickname } = req.body.player;
    let grid: Array<number> = [];
    grid = Array(9).fill(0);
    const room = await createRoom(roomId, { uuid, nickname, turn: uuid }, grid);
    res.json({ ...room });
}))

router.get(endpoints.tictactoe.GET_ROOMS, handleAsyncError(async (req, res) => {
    const rooms = await getRooms();
    res.json({ rooms });
}))

router.get(endpoints.tictactoe.GET_ROOM, handleAsyncError(async (req, res) => {
    const roomId = req.params.roomId;
    const rooms = await getRoom(roomId);
    res.json({ rooms });
}))

router.put(endpoints.tictactoe.ADD_PLAYER_TO_ROOM, addPlayerToRoomRules, validate, handleAsyncError(async (req, res) => {
    const { roomId } = req.body;
    const { uuid, nickname } = req.body.player;
    const room = await addPlayerToRoom(roomId, { uuid, nickname });
    res.json({ ...room['_doc'] })
}))

router.delete(endpoints.tictactoe.REMOVE_ROOM, handleAsyncError(async (req, res) => {
    const roomId = req.params.roomId;
    const roomDeleted = await removeRoom(roomId);
    res.json({ roomDeleted });
}))

export { router as tictactoeRouter };