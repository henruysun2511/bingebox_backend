import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const GetCategoryIdParam = z.object({
  id: objectIdSchema,
});

export const createCategoryBody = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(50, "Tên danh mục không được vượt quá 50 ký tự"),
});

export type CreateCategoryBody = z.infer<typeof createCategoryBody>;

export const updateCategoryBody = createCategoryBody.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải cập nhật ít nhất một trường"
);

export type UpdateCategoryBody = z.infer<typeof updateCategoryBody>;
