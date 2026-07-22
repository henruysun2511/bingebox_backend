import mongoose from "mongoose";

interface ISeat {
    _id?: mongoose.Types.ObjectId;
    room: mongoose.Types.ObjectId;
    code: string;
    row?: string;
    column?: number;
    isBlocked?: boolean;
    seatType: mongoose.Types.ObjectId;
    isCoupleSeat: boolean;
    partnerSeat?: mongoose.Types.ObjectId;
    partnerSeatCode?: string;
}

export type { ISeat };
