import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { GenderEnum } from "../../shares/constants/enum";

interface IActor extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string;
    bio?: string;
    avatar: string;
    nationality?: string;
    gender?: GenderEnum;
}

export type { IActor };
