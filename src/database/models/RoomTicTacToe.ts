import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;

export interface playsType extends Document {
    roomId: string,
    players: Array<{ uuid: string, nickname: string }>,
    turn: string,
    grid: Array<number>,
    retry: Array<string>
}

const RoomTicTacToe = new Schema({
    roomId: { type: String, required: true, unique: true, dropDups: true },
    players: [{ uuid: { type: String }, nickname: { type: String }, value: { type: Number } }],
    turn: { type: String, required: true },
    grid: [{ type: Number }],
    retry: [{ type: String }]
})

module.exports = mongoose.model<playsType>('RoomTicTacToe', RoomTicTacToe);