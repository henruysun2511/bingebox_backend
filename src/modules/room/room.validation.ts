import { z } from "zod";
import { BaseStatusEnum } from "../../shares/constants/enum";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getRoomListQuery = z.object({
  cinemaId: objectIdSchema.optional(),
  name: z.string().trim().optional(),
});

export type GetRoomListQuery = z.infer<typeof getRoomListQuery>;

export const getRoomIdParam = z.object({
  id: objectIdSchema,
});

export const createRoomBody = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên phòng không được để trống"),
  cinema: objectIdSchema,
  format: objectIdSchema,
  seatLayout: z.object({}).optional(),
});

export type CreateRoomBody = z.infer<typeof createRoomBody>;

export const updateRoomBody = createRoomBody.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải có ít nhất một trường cần cập nhật"
);

export type UpdateRoomBody = z.infer<typeof updateRoomBody>;

export const updateRoomStatusBody = z.object({
  status: z.nativeEnum(BaseStatusEnum),
});
