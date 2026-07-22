import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface IFormatRoom extends IBaseDocument {
    _id?: mongoose.Types.ObjectId,
    name: string,
    description?: string,
    image?: string,
}

export type { IFormatRoom };
