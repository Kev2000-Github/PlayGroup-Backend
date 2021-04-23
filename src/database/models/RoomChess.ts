import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;

export interface playsType extends Document {
    roomId: string,
    players: Array<{ uuid: string, nickname: string }>,
    turn: string,
    grid: { value: number, pos: string }[],
    retry: Array<string>
}

const RoomChess = new Schema({
    roomId: { type: String, required: true, unique: true, dropDups: true },
    players: [{ uuid: { type: String }, nickname: { type: String }, value: { type: Number } }],
    turn: { type: String, required: true },
    grid: [{
        value: { type: Number },
        pos: { type: String }
    }],
    retry: [{ type: String }]
})

module.exports = mongoose.model<playsType>('RoomChess', RoomChess);