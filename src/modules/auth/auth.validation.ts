import { z } from "zod";
import { GenderEnum } from "../../shares/constants/enum";

export const registerBody = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Tên đăng nhập tối thiểu 3 ký tự")
    .max(30, "Tên đăng nhập tối đa 30 ký tự"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .transform(v => v.toLowerCase()),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
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
  birth: z
    .string()
    .or(z.date())
    .refine(v => new Date(v) < new Date(), "Ngày sinh phải là một ngày trong quá khứ")
    .transform(v => new Date(v)),
  gender: z
    .nativeEnum(GenderEnum)
    .optional(),
});

export type RegisterBody = z.infer<typeof registerBody>;

export const loginBody = z.object({
  username: z
    .string()
    .min(1, "Tên đăng nhập không được để trống"),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống"),
});

export type LoginBody = z.infer<typeof loginBody>;

export const forgotPasswordBody = z.object({
  email: z
    .string()
    .email("Email không hợp lệ"),
});

export const resetPasswordBody = z.object({
  email: z
    .string()
    .email("Email không hợp lệ"),
  otp: z
    .string()
    .length(6, "OTP phải có đúng 6 ký tự"),
  newPassword: z
    .string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
});

export const ChangePasswordBody = z.object({
  oldPassword: z
    .string()
    .min(6, "Mật khẩu cũ phải có ít nhất 6 ký tự"),
  newPassword: z
    .string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z
    .string()
    .min(6),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
});

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBody>;
