import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { IRole } from "../../types/object.type";

const roleSchema = new mongoose.Schema<IRole>({
    ...baseFields,
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    }]
}, {
    timestamps: true
});

export default mongoose.model<IRole>('Role', roleSchema);