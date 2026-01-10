import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";

const ageTypeSchema = new mongoose.Schema({
    ...baseFields,
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    minAge: { 
        type: Number, 
        required: true,
        min: 0 
    },
    maxAge: { 
        type: Number, 
        required: true,
        min: 1
    }
}, { timestamps: true });

export default mongoose.model('AgeType', ageTypeSchema);