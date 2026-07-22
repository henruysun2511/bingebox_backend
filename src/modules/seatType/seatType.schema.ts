import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { ISeatType } from "./seatType.interface";

const seatTypeSchema = new mongoose.Schema<ISeatType>({
    ...baseFields,
    name: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true,
        default: "#FFFFFF"
    }
}, {
    timestamps: true
});

export default mongoose.model<ISeatType>('SeatType', seatTypeSchema);