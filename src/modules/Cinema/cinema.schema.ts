import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { ICinema } from "../../types/object.type";

const cinemaSchema = new mongoose.Schema<ICinema>({
    ...baseFields,
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true 
    },
    description: String,
    image: String,
}, {
    timestamps: true
});

export default mongoose.model<ICinema>('Cinema', cinemaSchema);