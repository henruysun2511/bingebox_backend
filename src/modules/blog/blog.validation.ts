import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID phải đúng 24 ký tự");

export const blogIdParam = z.object({
  id: objectIdSchema,
});

export const createBlogBody = z.object({
  title: z
    .string()
    .min(10, "Tiêu đề phải có ít nhất 10 ký tự"),
  content: z
    .string()
    .min(1, "Nội dung bài viết không được để trống"),
  thumbnail: z
    .string()
    .url("Thumbnail phải là một đường dẫn URL hợp lệ")
    .optional()
    .or(z.literal("")),
  isPublished: z
    .boolean()
    .optional(),
});

export type CreateBlogBody = z.infer<typeof createBlogBody>;

export const updateBlogBody = createBlogBody.partial().refine(
  d => Object.keys(d).length > 0,
  "Cần ít nhất một trường để cập nhật"
);

export type UpdateBlogBody = z.infer<typeof updateBlogBody>;

export const blogListQuery = z.object({
  search: z.string().optional(),
  title: z.string().optional(),
  isPublished: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).optional(),
});

export type BlogListQuery = z.infer<typeof blogListQuery>;

export const getBlogIdParam = z.object({
  id: objectIdSchema,
});

export const updateBlogPublishedBody = z.object({
  isPublished: z.boolean(),
});
