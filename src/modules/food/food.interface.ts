import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface IFood extends IBaseDocument {
    _id: mongoose.Types.ObjectId,
    name: string,
    image: string,
    price: Number
}

export type { IFood };
