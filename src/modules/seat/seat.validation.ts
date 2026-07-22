import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

const seatItemSchema = z.object({
  code: z.string().min(1),
  row: z
    .string()
    .regex(/^[A-Z]$/, "Row phải là chữ cái A-Z"),
  column: z
    .number()
    .int()
    .min(1)
    .nullable(),
  isBlocked: z.boolean().default(false),
  seatTypeId: objectIdSchema.optional(),
  isCoupleSeat: z.boolean().default(false),
  partnerSeatCode: z.string().optional(),
}).refine(d => {
  if (d.isBlocked) return !d.seatTypeId;
  return !!d.seatTypeId;
}, { message: "Ghế không bị chặn phải có seatTypeId", path: ["seatTypeId"] }).refine(d => {
  if (d.isCoupleSeat) return !!d.partnerSeatCode;
  return !d.partnerSeatCode;
}, { message: "Ghế đôi phải có partnerSeatCode", path: ["partnerSeatCode"] });

export const updateSeatSchema = {
  params: z.object({
    roomId: objectIdSchema,
  }),
  body: z.object({
    seats: z.array(seatItemSchema).min(1),
  }),
};

export const getSeatsByRoomParam = z.object({
  roomId: objectIdSchema,
});

export const getSeatsByShowtimeParam = z.object({
  showtimeId: objectIdSchema,
});
