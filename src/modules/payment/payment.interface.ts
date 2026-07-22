import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { PaymentMethodEnum, PaymentStatusEnum } from "../../shares/constants/enum";

interface IPayment extends IBaseDocument {
    _id: mongoose.Types.ObjectId;
    booking: mongoose.Types.ObjectId;
    referenceCode: string;
    bankTransactionId?: string;
    amount: number;
    method: PaymentMethodEnum;
    status: PaymentStatusEnum;
}

export type { IPayment };
