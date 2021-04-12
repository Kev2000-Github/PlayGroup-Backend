import { Router } from 'express';
import { createRoom, addPlayerToRoom, removeRoom, getRooms, getRoom } from "./rooms.service";
const router = Router();

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
router.post("/", async (req, res) => {
    const { roomId, playerHost } = req.body;
    const room = await createRoom(roomId, { ...playerHost, turn: false });
    res.json({ ...room });
})

router.get("/", async (req, res) => {
    const rooms = await getRooms();
    res.json({ rooms });
})

router.get("/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    const rooms = await getRoom(roomId);
    res.json({ rooms });
})

router.put("/", async (req, res) => {
    const { player, roomId } = req.body;
    const room = await addPlayerToRoom(roomId, { ...player, turn: false });
    res.json({ ...room['_doc'] })
})

export { router as roomRouter };