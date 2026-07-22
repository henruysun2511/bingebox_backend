import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { BaseStatusEnum } from "../../shares/constants/enum";

interface IRoom extends IBaseDocument {
    _id?: mongoose.Types.ObjectId,
    name: string,
    cinema: mongoose.Types.ObjectId,
    format: mongoose.Types.ObjectId,
    status: BaseStatusEnum;
    seatLayout: {
        rows?: number;
        columns?: number;
    };
    totalSeats: number;
}

export type { IRoom };
