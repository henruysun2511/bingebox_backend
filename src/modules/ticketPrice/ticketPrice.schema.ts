import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { DayOfWeekEnum } from "../../shares/constants/enum";

const ticketPriceSchema = new mongoose.Schema({
    ...baseFields,
    timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
    ageType: { type: mongoose.Schema.Types.ObjectId, ref: 'AgeType', required: true },
    formatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'Format', required: true },
    seatType: { type: mongoose.Schema.Types.ObjectId, ref: 'SeatType', required: true },
    dayOfWeek: { 
        type: String, 
        enum: Object.values(DayOfWeekEnum), 
        required: true 
    },
    finalPrice: { type: Number, required: true, min: 0 }
}, { timestamps: true });

export default mongoose.model('TicketPrice', ticketPriceSchema);