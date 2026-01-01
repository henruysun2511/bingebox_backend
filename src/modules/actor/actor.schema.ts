import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { GenderEnum } from "../../shares/constants/enum";
import { IActor } from "../../types/object.type";

const actorSchema = new mongoose.Schema<IActor>({
    ...baseFields,
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.OTHER,
    },
    avatar: {
        type: String,
        required: true
    },
    nationality: String,
    bio: String,
}, {
    timestamps: true
});

export default mongoose.model<IActor>('Actor', actorSchema);