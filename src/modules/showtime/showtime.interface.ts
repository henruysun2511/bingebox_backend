import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { BaseStatusEnum } from "../../shares/constants/enum";

interface IShowtime extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    movie: mongoose.Types.ObjectId;
    subtitle?: BaseStatusEnum;
    room: mongoose.Types.ObjectId;
    startTime: Date
    endTime: Date
    status: BaseStatusEnum
    timeslot: mongoose.Types.ObjectId;
}

export type { IShowtime };
