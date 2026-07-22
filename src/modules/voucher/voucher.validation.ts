import { z } from "zod";
import { BaseStatusEnum } from "../../shares/constants/enum";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getVoucherListQuery = z.object({
  name: z.string().trim().optional(),
  code: z.string().trim().optional(),
  status: z.nativeEnum(BaseStatusEnum).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.string().optional(),
});

export type GetVoucherListQuery = z.infer<typeof getVoucherListQuery>;

export const getVoucherIdParam = z.object({
  id: objectIdSchema,
});

const voucherBody = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên voucher không được để trống"),
  code: z
    .string()
    .trim()
    .transform(v => v.toUpperCase()),
  description: z
    .string()
    .optional(),
  startTime: z
    .string()
    .or(z.date())
    .transform(v => new Date(v)),
  endTime: z
    .string()
    .or(z.date())
    .transform(v => new Date(v)),
  minOrderValue: z
    .number()
    .min(0, "Giá trị đơn hàng tối thiểu không được âm"),
  maxDiscountAmount: z
    .number()
    .min(0, "Số tiền giảm tối đa không được âm"),
  maxUsage: z
    .number()
    .int()
    .min(1, "Số lần sử dụng tối đa phải ít nhất là 1"),
  status: z
    .nativeEnum(BaseStatusEnum)
    .optional(),
});

export const createVoucher = voucherBody.refine(d => d.endTime > d.startTime, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["endTime"],
});

export type CreateVoucherBody = z.infer<typeof createVoucher>;

export const updateVoucher = voucherBody.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải có ít nhất một trường cần cập nhật"
);

export type UpdateVoucherBody = z.infer<typeof updateVoucher>;

export const updateVoucherStatusBody = z.object({
  status: z.nativeEnum(BaseStatusEnum),
});
