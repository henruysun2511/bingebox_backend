import Joi from "joi";
import { GenderEnum } from "../../shares/constants/enum";

export const updateUserProfileBody = Joi.object({
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

    gender: Joi.string()
        .valid(...Object.values(GenderEnum))
        .optional()
        .messages({
            "any.only": "Giới tính không hợp lệ",
        }),

    birth: Joi.date()
        .required()
        .less("now")
        .messages({
            "date.base": "Ngày sinh không hợp lệ",
            "date.less": "Ngày sinh phải là một ngày trong quá khứ",
            "any.required": "Vui lòng cung cấp ngày sinh",
        }),
});

export const assignRole = Joi.object({
  roleId: Joi.string().hex().length(24).required().messages({
    "string.length": "ID vai trò không hợp lệ",
    "any.required": "ID vai trò là bắt buộc",
  }),
});

export const getUserIdParam = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "any.required": "ID người dùng là bắt buộc",
  }),
});

export const getUserListQuery = Joi.object({
    username: Joi.string().trim().optional(),
    email: Joi.string().trim().optional(),
    role: Joi.string().hex().length(24).optional(),
    isBlocked: Joi.string().valid('true', 'false').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    sort: Joi.string().optional(),
});

export const blockUserBody = Joi.object({
    isBlocked: Joi.boolean().required().messages({
        "any.required": "Trạng thái khóa/mở là bắt buộc",
        "boolean.base": "Trạng thái phải là kiểu boolean (true/false)"
    })
});

export const redeemPoints = Joi.object({
  points: Joi.number().integer().min(1).required().messages({
    "number.base": "Số điểm phải là một con số",
    "number.min": "Số điểm trừ phải ít nhất là 1",
    "any.required": "Số điểm cần trừ là bắt buộc",
  }),
  reason: Joi.string().trim().optional(),
});