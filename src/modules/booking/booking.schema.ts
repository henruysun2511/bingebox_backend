import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { BookingStatusEnum } from "../../shares/constants/enum";
import { IBooking } from "../../types/object.type";

const bookingSchema = new mongoose.Schema<IBooking>({
    ...baseFields,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Showtime',
        required: true
    },
    foods: [{
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        quantity: { type: Number, required: true },
        priceAtBooking: { type: Number, required: true }
    }],
    voucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
        default: null
    },
    pointsUsed: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    bookingStatus: {
        type: String,
        enum: Object.values(BookingStatusEnum),
        default: BookingStatusEnum.PENDING
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } 
    }
}, {
    timestamps: true
});

// Tạo index để truy vấn nhanh lịch sử mua vé của user
bookingSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);