import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;

export type player = {
    uuid: string,
    nickname: string,
    turn: boolean
}

export interface playsType extends Document {
    playerHost: player,
    playerTwo: player,
    roomId: string
}

const Room = new Schema({
    roomId: { type: String, required: true, unique: true, dropDups: true },
    playerHost: {
        uuid: { type: String },
        nickname: { type: String },
        turn: { type: Boolean }
    },
    playerTwo: {
        uuid: { type: String },
        nickname: { type: String },
        turn: { type: Boolean }
    }
})

module.exports = mongoose.model<playsType>('Room', Room);