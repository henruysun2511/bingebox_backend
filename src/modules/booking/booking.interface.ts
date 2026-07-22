import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { BookingStatusEnum } from "../../shares/constants/enum";

interface IBooking extends IBaseDocument {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    showtime: mongoose.Types.ObjectId;
    foods: {
        foodId: mongoose.Types.ObjectId;
        quantity: number;
        priceAtBooking: number;
    }[];
    voucher?: mongoose.Types.ObjectId;
    pointsUsed?: number;
    pointsEarned?: number;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    bookingStatus: BookingStatusEnum;
    expiresAt: Date;
}

export type { IBooking };
