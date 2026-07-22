import mongoose from "mongoose";
import { ISeat } from "./seat.interface";

const seatSchema = new mongoose.Schema<ISeat>({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },

  code: { type: String, required: true },

  row: String,
  column: Number,

  isBlocked: { type: Boolean, default: false }, //ô trống

  seatType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SeatType",
    required: false,
    default: null
  },

  isCoupleSeat: { type: Boolean, default: false },
  partnerSeat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    default: null
  },
  partnerSeatCode: {
    type: String,
    default: null
  },
}, { timestamps: true });

// seatSchema.index({ room: 1, code: 1 }, { unique: true });


export default mongoose.model<ISeat>("Seat", seatSchema);