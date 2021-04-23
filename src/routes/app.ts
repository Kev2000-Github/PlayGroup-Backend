import { Router } from 'express';
import { tictactoeRouter } from "./rooms/tictactoe/tictactoe";
import { chessRouter } from "./rooms/chess/chess";
import { errorHandler } from "../middleware/errorHandler";
const router = Router();

router.use("/tictactoe/rooms", tictactoeRouter);
router.use("/chess/rooms", chessRouter);
router.use(errorHandler);

export { router as router };