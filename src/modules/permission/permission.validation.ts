import { z } from "zod";
import { PermissionMethodTypeEnum } from "../../shares/constants/enum";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getPermissionListQuery = z.object({
  name: z.string().trim().optional(),
  path: z.string().trim().optional(),
  method: z.nativeEnum(PermissionMethodTypeEnum).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.string().optional(),
});

export type GetPermissionListQuery = z.infer<typeof getPermissionListQuery>;

export const getPermissionIdParam = z.object({
  id: objectIdSchema,
});

export const createPermission = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên quyền hạn không được để trống"),
  path: z
    .string()
    .trim()
    .min(1, "Đường dẫn (Path) không được để trống"),
  method: z
    .nativeEnum(PermissionMethodTypeEnum),
  description: z
    .string()
    .optional(),
});

export type CreatePermissionBody = z.infer<typeof createPermission>;

export const updatePermission = createPermission.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải có ít nhất một trường cần cập nhật"
);

export type UpdatePermissionBody = z.infer<typeof updatePermission>;
