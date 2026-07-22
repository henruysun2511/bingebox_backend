import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { DayOfWeekEnum } from "../../shares/constants/enum";

interface ITicketPrice extends IBaseDocument {
    _id: mongoose.Types.ObjectId,
    timeSlot: mongoose.Types.ObjectId,
    ageType: mongoose.Types.ObjectId,
    formatRoom: mongoose.Types.ObjectId,
    seatType: mongoose.Types.ObjectId,
    dayOfWeek: DayOfWeekEnum,
    finalPrice: number
}

export type { ITicketPrice };
