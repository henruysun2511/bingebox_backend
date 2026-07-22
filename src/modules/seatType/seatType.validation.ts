import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getSeatTypeIdParam = z.object({
  id: objectIdSchema,
});

export const createSeatType = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên loại ghế không được để trống"),
  color: z
    .string()
    .trim()
    .min(1, "Mã màu không được để trống"),
});

export type CreateSeatTypeBody = z.infer<typeof createSeatType>;

export const updateSeatType = createSeatType.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải có ít nhất một trường cần cập nhật"
);

export type UpdateSeatTypeBody = z.infer<typeof updateSeatType>;
