import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getFormatRoomIdParam = z.object({
  id: objectIdSchema,
});

export const createFormatRoom = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên định dạng không được để trống"),
  description: z
    .string()
    .optional(),
  image: z
    .string()
    .url("Link ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
});

export type CreateFormatRoomBody = z.infer<typeof createFormatRoom>;

export const updateFormatRoom = createFormatRoom.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải có ít nhất một trường cần cập nhật"
);

export type UpdateFormatRoomBody = z.infer<typeof updateFormatRoom>;
