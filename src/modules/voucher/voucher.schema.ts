import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { BaseStatusEnum } from "../../shares/constants/enum";
import { IVoucher } from "../../types/object.type";

const voucherSchema = new mongoose.Schema<IVoucher>({
    ...baseFields,
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    minOrderValue: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    maxDiscountAmount: {
        type: Number,
        required: true,
        min: 0
    },
    usedCount: {
        type: Number,
        default: 0,
        min: 0
    },
    maxUsage: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: Object.values(BaseStatusEnum),
        default: BaseStatusEnum.ACTIVE,
        required: true
    }
}, {
    timestamps: true
});

// Index để tìm kiếm nhanh theo code và kiểm tra hiệu lực thời gian
voucherSchema.index({ code: 1, isDeleted: 1 });
voucherSchema.index({ startTime: 1, endTime: 1 });

export default mongoose.model<IVoucher>('Voucher', voucherSchema);