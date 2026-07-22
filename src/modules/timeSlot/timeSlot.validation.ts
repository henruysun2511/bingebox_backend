import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createTimeSlot = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên khung giờ không được để trống"),
  startTime: z
    .string()
    .regex(timeRegex, "Giờ bắt đầu phải theo định dạng HH:mm (VD: 08:00)"),
  endTime: z
    .string()
    .regex(timeRegex, "Giờ kết thúc phải theo định dạng HH:mm (VD: 12:00)"),
});

export type CreateTimeSlotBody = z.infer<typeof createTimeSlot>;

export const updateTimeSlot = createTimeSlot.partial();

export type UpdateTimeSlotBody = z.infer<typeof updateTimeSlot>;

export const getTimeSlotQuery = z.object({
  name: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).optional(),
});
