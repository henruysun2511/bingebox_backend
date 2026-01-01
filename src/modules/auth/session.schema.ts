import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { ISession } from "../../types/object.type";

const sessionSchema = new mongoose.Schema<ISession>({
    ...baseFields,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
},
    {
        timestamps: true,
    }
);

export default mongoose.model<ISession>('Session', sessionSchema);