import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { IFood } from "../../types/object.type";

const foodSchema = new mongoose.Schema<IFood>({
    ...baseFields,
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

export default mongoose.model<IFood>('Food', foodSchema);