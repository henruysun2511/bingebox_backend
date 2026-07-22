import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface ICinema extends IBaseDocument {
    _id?: mongoose.Types.ObjectId,
    name: string,
    location: string,
    description?: string,
    image?: string,
    province?: string
}

export type { ICinema };
