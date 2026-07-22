import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getRoleListQuery = z.object({
  name: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type GetRoleListQuery = z.infer<typeof getRoleListQuery>;

export const getRoleIdParam = z.object({
  id: objectIdSchema,
});

export const createRole = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên vai trò không được để trống"),
  description: z
    .string()
    .optional(),
  permissions: z
    .array(z.string())
    .optional()
    .default([]),
});

export type CreateRoleBody = z.infer<typeof createRole>;

export const updateRole = createRole.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải có ít nhất một trường cần cập nhật"
);

export type UpdateRoleBody = z.infer<typeof updateRole>;
