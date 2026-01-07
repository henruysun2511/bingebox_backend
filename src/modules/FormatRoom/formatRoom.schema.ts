import { IFormatRoom } from "@/types/object.type";
import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";

const formatRoomSchema = new mongoose.Schema<IFormatRoom>({
    ...baseFields,
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: String,
    image: String,
}, {
    timestamps: true
});

export default mongoose.model<IFormatRoom>('FormatRoom', formatRoomSchema);