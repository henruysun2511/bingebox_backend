import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface ITimeSlot extends IBaseDocument {
    _id?: mongoose.Types.ObjectId,
    name: string,
    startTime: string,
    endTime: string,
}

export type { ITimeSlot };
