import { z } from "zod";
import { GenderEnum } from "../../shares/constants/enum";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const updateUserProfileBody = z.object({
  fullName: z
    .string()
    .trim()
    .max(100)
    .optional(),
  avatar: z
    .string()
    .url("Avatar phải là URL hợp lệ")
    .optional()
    .or(z.literal("")),
  gender: z
    .nativeEnum(GenderEnum)
    .optional(),
  birth: z
    .string()
    .or(z.date())
    .refine(v => new Date(v) < new Date(), "Ngày sinh phải là một ngày trong quá khứ")
    .transform(v => new Date(v))
    .optional(),
  banner: z
    .string()
    .url("Banner phải là URL hợp lệ")
    .optional()
    .or(z.literal("")),
  tags: z
    .array(z.string().trim())
    .max(3, "Bạn chỉ được chọn tối đa 3 danh hiệu")
    .optional(),
});

export const assignRole = z.object({
  roleId: objectIdSchema,
});

export const getUserIdParam = z.object({
  id: objectIdSchema,
});

export const getUserListQuery = z.object({
  username: z.string().trim().optional(),
  email: z.string().trim().optional(),
  role: objectIdSchema.optional(),
  isBlocked: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.string().optional(),
});

export const blockUserBody = z.object({
  isBlocked: z.boolean(),
});

export type UpdateUserProfileBody = z.infer<typeof updateUserProfileBody>;
export type GetUserListQuery = z.infer<typeof getUserListQuery>;

export const redeemPoints = z.object({
  points: z
    .number()
    .int()
    .min(1, "Số điểm trừ phải ít nhất là 1"),
  reason: z
    .string()
    .trim()
    .optional(),
});
