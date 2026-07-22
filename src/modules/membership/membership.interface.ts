import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface IMembership extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string;
    minSpending: number;
    pointAccumulationRate: number;
    discountRate: number;
}

export type { IMembership };
