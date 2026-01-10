import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { IMembership } from "../../types/object.type";

const membershipSchema = new mongoose.Schema<IMembership>({
    ...baseFields,
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    minSpending: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    pointAccumulationRate: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 1 
    },
    discountRate: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 1 
    }
}, { timestamps: true });

export default mongoose.model<IMembership>('Membership', membershipSchema);