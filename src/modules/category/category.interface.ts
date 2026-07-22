import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface ICategory extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string;
}

export type { ICategory };
