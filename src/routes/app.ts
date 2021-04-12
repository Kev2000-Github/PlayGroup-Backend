import { Router } from 'express';
import { tictactoeRouter } from "./tictactoe/tictactoe";
import { roomRouter } from "./tictactoe/rooms";

const router = Router();


router.use("/", tictactoeRouter);
router.use("/rooms", roomRouter);

export { router as router };