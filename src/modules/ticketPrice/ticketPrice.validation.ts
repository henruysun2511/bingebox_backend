import { z } from "zod";
import { DayOfWeekEnum } from "../../shares/constants/enum";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID phải đúng 24 ký tự");

export const ticketPriceIdParam = z.object({
  id: objectIdSchema,
});

export const createTicketPriceBody = z.object({
  timeSlot: objectIdSchema,
  ageType: objectIdSchema,
  formatRoom: objectIdSchema,
  seatType: objectIdSchema,
  dayOfWeek: z.nativeEnum(DayOfWeekEnum),
  finalPrice: z
    .number()
    .min(0, "Giá vé không được nhỏ hơn 0"),
});

export type CreateTicketPriceBody = z.infer<typeof createTicketPriceBody>;

export const updateTicketPriceBody = createTicketPriceBody.partial().refine(
  d => Object.keys(d).length > 0,
  "Cần ít nhất một trường để cập nhật"
);

export type UpdateTicketPriceBody = z.infer<typeof updateTicketPriceBody>;

export const ticketPriceListQuery = z.object({
  timeSlot: objectIdSchema.optional(),
  ageType: objectIdSchema.optional(),
  formatRoom: objectIdSchema.optional(),
  seatType: objectIdSchema.optional(),
  dayOfWeek: z.nativeEnum(DayOfWeekEnum).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.string().optional(),
});

export type TicketPriceListQuery = z.infer<typeof ticketPriceListQuery>;
