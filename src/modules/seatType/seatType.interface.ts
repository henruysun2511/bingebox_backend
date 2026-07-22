import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface ISeatType extends IBaseDocument {
    _id: mongoose.Types.ObjectId,
    name: string,
    color: string
}

export type { ISeatType };
