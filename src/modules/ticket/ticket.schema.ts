import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { TicketStatusEnum } from "../../shares/constants/enum";
import { ITicket } from "../../types/object.type";

const ticketSchema = new mongoose.Schema<ITicket>({
    ...baseFields,
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Showtime',
        required: true
    },
    seat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat',
        required: true
    },
    ticketPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TicketPrice',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    qrCode: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: Object.values(TicketStatusEnum)
    },
    expiresAt: {
        type: Date,
        index: true
    }
}, {
    timestamps: true
});

//Chỉ tồn tại 1 ticket active, cancelled cho đặt lại
ticketSchema.index({ showtime: 1, seat: 1 }, { unique: true, partialFilterExpression: { status: { $ne: 'CANCELLED' } } });

export default mongoose.model<ITicket>('Ticket', ticketSchema);