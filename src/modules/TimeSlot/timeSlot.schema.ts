import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { ITimeSlot } from "../../types/object.type";

const timeSlotSchema = new mongoose.Schema<ITimeSlot>({
    ...baseFields,
    name: { type: String, required: true },
    startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }, // Định dạng "HH:mm"
    endTime: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },   // Định dạng "HH:mm"
}, { timestamps: true });


export default mongoose.model<ITimeSlot>('TimeSlot', timeSlotSchema);