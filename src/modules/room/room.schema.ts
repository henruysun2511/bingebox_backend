import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { BaseStatusEnum } from "../../shares/constants/enum";
import { IRoom } from "./room.interface";

const roomSchema = new mongoose.Schema<IRoom>({
    ...baseFields,
    name: { type: String, required: true },
    cinema: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema', required: true },
    format: { type: mongoose.Schema.Types.ObjectId, ref: 'FormatRoom', required: true },
    status: { type: String, enum: Object.values(BaseStatusEnum), default: BaseStatusEnum.ACTIVE },
    seatLayout: {
        rows: Number,
        columns: Number,
    },
    totalSeats: Number,
}, { timestamps: true });

export default mongoose.model<IRoom>('Room', roomSchema);