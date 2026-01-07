import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { BaseStatusEnum, SeatLayoutTypeEnum } from "../../shares/constants/enum";
import { IRoom } from "../../types/object.type";

const roomSchema = new mongoose.Schema<IRoom>({
    ...baseFields,
    name: { type: String, required: true },
    cinema: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema', required: true },
    format: { type: mongoose.Schema.Types.ObjectId, ref: 'Format', required: true },
    status: { type: String, enum: Object.values(BaseStatusEnum), default: BaseStatusEnum.ACTIVE },
    seatLayout: {
        type: { type: String,  enum: Object.values(SeatLayoutTypeEnum), required: true },
        rows: Number,
        columns: Number,
        width: Number,
        height: Number
    },
    totalSeats: Number,
}, { timestamps: true });

export default mongoose.model<IRoom>('Room', roomSchema);