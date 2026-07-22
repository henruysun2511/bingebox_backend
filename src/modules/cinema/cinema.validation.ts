import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getCinemaListQuery = z.object({
  name: z.string().optional(),
  province: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.string().optional(),
});

export type GetCinemaListQuery = z.infer<typeof getCinemaListQuery>;

export const getCinemaIdParam = z.object({
  id: objectIdSchema,
});

export const createCinema = z.object({
  name: z.string().min(1, "Tên rạp là bắt buộc"),
  location: z.string().min(1, "Địa chỉ rạp là bắt buộc"),
  province: z.string().min(1, "Tỉnh/Thành phố là bắt buộc"),
  description: z.string().optional(),
  image: z.string().url("Link ảnh không hợp lệ").optional().or(z.literal("")),
});

export type CreateCinemaBody = z.infer<typeof createCinema>;

export const updateCinema = createCinema.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải có ít nhất một trường cần cập nhật"
);

export type UpdateCinemaBody = z.infer<typeof updateCinema>;
