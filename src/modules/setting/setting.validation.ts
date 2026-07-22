import { z } from "zod";
import { BaseStatusEnum } from "../../shares/constants/enum";

export const updateSettingBody = z.object({
  logo: z
    .string()
    .min(1, "Logo không được để trống"),
  name: z
    .string()
    .min(1, "Tên website không được để trống"),
  company: z
    .string()
    .min(1, "Tên công ty không được để trống"),
  email: z
    .string()
    .email("Email không đúng định dạng"),
  address: z
    .string()
    .min(1, "Địa chỉ không được để trống"),
  hotline: z
    .string()
    .min(1, "Số hotline không được để trống"),
  workHours: z
    .string()
    .optional(),
  social: z.object({
    facebook: z.string().url("Link Facebook không hợp lệ").optional().or(z.literal("")),
    instagram: z.string().url("Link Instagram không hợp lệ").optional().or(z.literal("")),
    tiktok: z.string().url("Link Tiktok không hợp lệ").optional().or(z.literal("")),
    zalo: z.string().optional(),
  }).optional(),
  banner: z.array(z.object({
    image: z.string().min(1, "Ảnh banner không được để trống"),
    link: z.string().url("Link điều hướng banner không hợp lệ").optional().or(z.literal("")),
    isActive: z.nativeEnum(BaseStatusEnum).optional(),
  })).optional(),
  popup: z.array(z.object({
    image: z.string().min(1, "Ảnh popup không được để trống"),
    link: z.string().url("Link điều hướng popup không hợp lệ").optional().or(z.literal("")),
    isActive: z.nativeEnum(BaseStatusEnum).optional(),
  })).optional(),
  metaTitle: z
    .string()
    .max(70, "Tiêu đề SEO không nên vượt quá 70 ký tự")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Mô tả SEO không nên vượt quá 160 ký tự")
    .optional(),
});
