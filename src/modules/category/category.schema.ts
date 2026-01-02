import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { ICategory } from "../../types/object.type";

const categorySchema = new mongoose.Schema<ICategory>({
    ...baseFields,
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
}, {
    timestamps: true
});

export default mongoose.model<ICategory>('Category', categorySchema);