import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { PaymentMethodEnum, PaymentStatusEnum } from "../../shares/constants/enum";
import { IPayment } from "./payment.interface";

const paymentSchema = new mongoose.Schema<IPayment>({
    ...baseFields,
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    referenceCode: {
        type: String,
        required: true,
        unique: true
    },
    bankTransactionId: {
        type: String,
        default: null,
        unique: true,
        sparse: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: Object.values(PaymentMethodEnum),
        required: true
    },
    status: {
        type: String,
        enum: Object.values(PaymentStatusEnum),
        default: PaymentStatusEnum.PENDING
    }
}, {
    timestamps: true
});

paymentSchema.index({ booking: 1 });
paymentSchema.index({ referenceCode: 1 });
paymentSchema.index({ status: 1 });

export default mongoose.model<IPayment>('Payment', paymentSchema);