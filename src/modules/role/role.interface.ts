import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface IRole extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string,
    description?: string,
    permissions: mongoose.Types.ObjectId[];
}

export type { IRole };
