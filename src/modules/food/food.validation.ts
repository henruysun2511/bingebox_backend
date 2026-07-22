import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getFoodIdParam = z.object({
  id: objectIdSchema,
});

export const getFoodListQuery = z.object({
  name: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
});

export type GetFoodListQuery = z.infer<typeof getFoodListQuery>;

export const createFoodBody = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên món ăn không được để trống"),
  image: z
    .string()
    .url("Link ảnh không đúng định dạng"),
  price: z
    .number()
    .min(0, "Giá tiền không được nhỏ hơn 0"),
});

export type CreateFoodBody = z.infer<typeof createFoodBody>;

export const updateFoodBody = createFoodBody.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải có ít nhất một trường cần cập nhật"
);

export type UpdateFoodBody = z.infer<typeof updateFoodBody>;
