import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const bookingBody = z.object({
  showtimeId: objectIdSchema,
  seatIds: z.array(z.string()).min(1, "Phải chọn ít nhất một ghế"),
  foods: z.array(z.object({
    foodId: objectIdSchema,
    quantity: z.number().int().min(1, "Số lượng phải lớn hơn 0"),
  })),
  voucherCode: z.string(),
  pointsUsed: z.number().min(0, "Điểm sử dụng không được âm").default(0),
});

export type IBookingBody = z.infer<typeof bookingBody>;

export const bookingIdParam = z.object({
  id: objectIdSchema,
});

export const getBookingListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.string().optional(),
});
