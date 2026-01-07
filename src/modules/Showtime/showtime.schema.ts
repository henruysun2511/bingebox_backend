import { IShowtime } from "@/types/object.type";
import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { BaseStatusEnum } from "../../shares/constants/enum";

const showtimeSchema = new mongoose.Schema<IShowtime>({
    ...baseFields,
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    timeslot: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
        type: String,
        enum: Object.values(BaseStatusEnum),
        default: BaseStatusEnum.ACTIVE
    },
}, { timestamps: true });

export default mongoose.model<IShowtime>('Showtime', showtimeSchema);