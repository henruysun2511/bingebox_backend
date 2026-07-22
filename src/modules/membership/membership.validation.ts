import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getMembershipIdParam = z.object({
  id: objectIdSchema,
});

export const createMembershipBody = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên hạng không được để trống"),
  minSpending: z
    .number()
    .min(0, "Chi tiêu tối thiểu không được nhỏ hơn 0"),
  pointAccumulationRate: z
    .number()
    .min(0, "Tỷ lệ tích điểm từ 0 đến 1")
    .max(1, "Tỷ lệ tích điểm từ 0 đến 1"),
  discountRate: z
    .number()
    .min(0, "Tỷ lệ giảm giá từ 0 đến 1")
    .max(1, "Tỷ lệ giảm giá từ 0 đến 1"),
});

export type CreateMembershipBody = z.infer<typeof createMembershipBody>;

export const updateMembershipBody = createMembershipBody.partial().refine(
  d => Object.keys(d).length > 0,
  "Cần ít nhất một trường để cập nhật"
);

export type UpdateMembershipBody = z.infer<typeof updateMembershipBody>;
