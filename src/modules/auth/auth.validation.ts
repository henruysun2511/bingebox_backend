import Joi from "joi";
import { GenderEnum } from "../../shares/constants/enum";

export const register = Joi.object({
    username: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.base": "Tên đăng nhập phải là chuỗi",
            "string.empty": "Tên đăng nhập không được để trống",
            "string.min": "Tên đăng nhập tối thiểu 3 ký tự",
            "string.max": "Tên đăng nhập tối đa 30 ký tự",
            "any.required": "Tên đăng nhập là bắt buộc",
        }),


    email: Joi.string()
        .email()
        .lowercase()
        .required()
        .messages({
            "string.email": "Email không hợp lệ",
            "string.empty": "Email không được để trống",
            "any.required": "Email là bắt buộc",
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
            "string.empty": "Mật khẩu không được để trống",
            "any.required": "Mật khẩu là bắt buộc",
        }),

    fullName: Joi.string()
        .trim()
        .max(100)
        .optional()
        .messages({
            "string.base": "Họ tên phải là chuỗi",
        }),

    avatar: Joi.string()
        .uri()
        .optional()
        .messages({
            "string.uri": "Avatar phải là URL hợp lệ",
        }),

    birth: Joi.date()
        .optional()
        .messages({
            "date.base": "Ngày sinh không hợp lệ",
        }),

    gender: Joi.string()
        .valid(...Object.values(GenderEnum))
        .optional()
        .messages({
            "any.only": "Giới tính không hợp lệ",
        }),
});

export const login = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "Tên đăng nhập không được để trống",
        "any.required": "Tên đăng nhập là bắt buộc",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Mật khẩu là bắt buộc",
    }),
});

export const forgotPassword = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "string.email": "Email không hợp lệ",
        "any.required": "Email là bắt buộc",
    }),
});

export const resetPassword = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "string.email": "Email không hợp lệ",
        "any.required": "Email là bắt buộc",
    }),
    otp: Joi.string().length(6).required().messages({
        "string.empty": "OTP không được để trống",
        "string.length": "OTP phải có đúng 6 ký tự",
        "any.required": "OTP là bắt buộc",
    }),
    newPassword: Joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Mật khẩu mới là bắt buộc",
    }),
});