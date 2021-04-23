const Room = require("../../../database/models/RoomChess");

export const createRoom = async (roomId: string, { uuid, turn, nickname }, grid: Array<{ value: number; pos: string; }>) => {
    const roomExists = await Room.findOne({ roomId });
    if (roomExists) return null;
    const room = { roomId, players: [{ uuid, nickname, value: -1 }], turn, retry: [], grid };
    const newRoom = new Room(room);
    await newRoom.save();
    return room;
}

export const getRooms = async () => {
    const rooms = await Room.find({});
    return rooms;
}

export const getRoom = async (roomId) => {
    const room = await Room.findOne({ roomId });
    return room;
}

export const addPlayerToRoom = async (roomId: string, { uuid, nickname }) => {
    const room = await Room.findOneAndUpdate({ roomId }, { $push: { players: { uuid, nickname, value: 1 } } }, { new: true });
    return room;
}

export const updateGrid = async (roomId: string, grid: Array<{ value: number; pos: string; }>) => {
    const room = await Room.findOneAndUpdate({ roomId }, { grid });
    return room;
}

export const addRetryRequest = async (roomId: string, uuid: string) => {
    const room = await Room.findOneAndUpdate({ roomId }, { $push: { retry: uuid } }, { new: true });
    return room;
}

export const clearRetryRequests = async (roomId: string) => {
    const room = await Room.findOneAndUpdate({ roomId }, { retry: [] }, { new: true });
    return room;
}

export const removePlayer = async (roomId: string, uuid: string) => {
    const room = await Room.findOneAndUpdate({ roomId }, { $pull: { players: { uuid } } }, { new: true });
    return room;
}

export const removeRoom = async (roomId: string) => {
    const room = await Room.findOneAndDelete({ roomId });
    return room;
}
