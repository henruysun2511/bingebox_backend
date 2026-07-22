import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { BaseStatusEnum } from "../../shares/constants/enum";

interface IVoucher extends IBaseDocument {
    _id: mongoose.Types.ObjectId,
    name: string,
    description: string,
    startTime: Date,
    endTime: Date,
    minOrderValue: number,
    maxDiscountAmount: number,
    usedCount: number,
    maxUsage: number,
    code: string,
    status: BaseStatusEnum
}

export type { IVoucher };
