import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const createComment = z.object({
  movie: objectIdSchema,
  content: z
    .string()
    .min(1, "Nội dung bình luận phải có ít nhất 1 ký tự")
    .max(500, "Bình luận không được vượt quá 500 ký tự"),
  rating: z
    .number()
    .min(1, "Đánh giá thấp nhất là 1 sao")
    .max(5, "Đánh giá cao nhất là 5 sao")
    .optional(),
  parent: objectIdSchema.optional(),
});

export type CreateCommentBody = z.infer<typeof createComment>;

export const updateComment = z.object({
  content: z
    .string()
    .min(1, "Nội dung bình luận phải có ít nhất 1 ký tự")
    .max(500, "Bình luận không được vượt quá 500 ký tự"),
});

export const getCommentParams = z.object({
  movieId: objectIdSchema,
});

export const commentIdParam = z.object({
  id: objectIdSchema,
});
