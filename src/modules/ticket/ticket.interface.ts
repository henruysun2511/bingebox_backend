import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { TicketStatusEnum } from "../../shares/constants/enum";

interface ITicket extends IBaseDocument {
    _id: mongoose.Types.ObjectId;
    booking: mongoose.Types.ObjectId;
    showtime: mongoose.Types.ObjectId;
    seat: mongoose.Types.ObjectId;
    ticketPrice: mongoose.Types.ObjectId;
    price: number;
    qrCode: string;
    status: TicketStatusEnum;
    expiresAt: Date;
    user: mongoose.Types.ObjectId;
}

export type { ITicket };
