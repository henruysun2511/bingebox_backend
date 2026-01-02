import Joi from "joi";
import { GenderEnum } from "../../shares/constants/enum";

export const updateUserProfile = Joi.object({
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