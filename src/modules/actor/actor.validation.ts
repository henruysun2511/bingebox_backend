import { z } from "zod";
import { GenderEnum } from "../../shares/constants/enum";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const GetActorListQuery = z.object({
  name: z.string().trim().optional(),
  alphabet: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(["name", "-name", "createdAt", "-createdAt"]).default("-createdAt"),
});

export type GetActorListQuery = z.infer<typeof GetActorListQuery>;

export const GetActorIdParam = z.object({
  id: objectIdSchema,
});

export const createActorBody = z.object({
  name: z
    .string()
    .min(2, "Tên diễn viên phải có ít nhất 2 ký tự"),
  avatar: z
    .string()
    .url("Avatar phải là một URL hợp lệ"),
  bio: z
    .string()
    .optional(),
  nationality: z
    .string()
    .optional(),
  gender: z
    .nativeEnum(GenderEnum)
    .optional(),
});

export type CreateActorBody = z.infer<typeof createActorBody>;

export const updateActorBody = createActorBody.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải cập nhật ít nhất một trường"
);

export type UpdateActorBody = z.infer<typeof updateActorBody>;
