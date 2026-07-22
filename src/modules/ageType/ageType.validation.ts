import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getAgeTypeIdParam = z.object({
  id: objectIdSchema,
});

export const getAgeTypeQuery = z.object({
  name: z.string().trim().optional(),
  age: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.string().optional(),
});

export type GetAgeTypeQuery = z.infer<typeof getAgeTypeQuery>;

const ageTypeBody = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên đối tượng không được để trống"),
  minAge: z
    .number()
    .min(0, "Tuổi tối thiểu không được nhỏ hơn 0"),
  maxAge: z
    .number()
    .min(0, "Tuổi tối đa phải lớn hơn hoặc bằng tuổi tối thiểu"),
});

export const createAgeTypeBody = ageTypeBody.refine(d => d.maxAge >= d.minAge, {
  message: "Tuổi tối đa phải lớn hơn hoặc bằng tuổi tối thiểu",
  path: ["maxAge"],
});

export type CreateAgeTypeBody = z.infer<typeof createAgeTypeBody>;

export const updateAgeTypeBody = ageTypeBody.partial().refine(
  d => Object.keys(d).length > 0,
  "Cần ít nhất một trường để cập nhật"
);

export type UpdateAgeTypeBody = z.infer<typeof updateAgeTypeBody>;
