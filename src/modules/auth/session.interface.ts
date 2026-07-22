import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface ISession extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
}

export type { ISession };
