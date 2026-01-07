import mongoose from "mongoose";
import { ISeat } from "../../types/object.type";

const seatSchema = new mongoose.Schema<ISeat>({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },

  code: { type: String, required: true },

  row: Number,
  column: Number,

  position: {
    x: Number,
    y: Number
  },

  isBlocked: { type: Boolean, default: false }, //ô trống

  seatType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SeatType",
    required: true
  },

  isCoupleSeat: { type: Boolean, default: false },
  partnerSeat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat" }
}, { timestamps: true });

seatSchema.index({ roomId: 1, code: 1 }, { unique: true });

export default mongoose.model<ISeat>("Seat", seatSchema);