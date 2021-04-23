import { body } from "express-validator";
import { config } from "../../../config/config";

export const createRoomRules = [
    body("roomId").trim().escape().matches(config.roomId).withMessage("invalid roomId"),
    body("game").trim().escape()
        .custom(data => /(tictactoe|chess)/.test(data)).withMessage("invalid game"),
    body("player.uuid").trim().escape().matches(config.uuid).withMessage("invalid uuid"),
    body("player.nickname").trim().escape().isString().withMessage("invalid nickname")
]

export const addPlayerToRoomRules = [
    body("roomId").trim().escape().matches(config.roomId).withMessage("invalid roomId"),
    body("player.uuid").trim().escape().matches(config.uuid).withMessage("invalid uuid"),
    body("player.nickname").trim().escape().isString().withMessage("invalid nickname")
]