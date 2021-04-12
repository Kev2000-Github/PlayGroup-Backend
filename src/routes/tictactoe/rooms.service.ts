import { player } from '../../database/models/Room';
const Room = require("../../database/models/Room");

export const createRoom = async (roomId: string, { uuid, turn, nickname }: player) => {
    const roomExists = await Room.findOne({ roomId });
    if (roomExists) return null;
    const playerTwo = { uuid: "", nickname: "", turn: false };
    const play = { roomId, playerHost: { uuid, turn, nickname }, playerTwo };
    const newRoom = new Room(play);
    await newRoom.save();
    return play;
}

export const getRooms = async () => {
    const rooms = await Room.find({});
    return rooms;
}

export const getRoom = async (roomId) => {
    const room = await Room.findOne({ roomId });
    return room;
}

export const addPlayerToRoom = async (roomId: string, { uuid, turn, nickname }: player) => {
    const room = await Room.findOneAndUpdate({ roomId }, { playerTwo: { uuid, turn, nickname } });
    console.log(roomId);
    return room;
}

export const removeRoom = async (roomId: string) => {
    const room = await Room.findOneAndDelete({ roomId });
    return room;
}
