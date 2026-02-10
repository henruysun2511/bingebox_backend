import Joi from "joi";
import { BaseStatusEnum } from "../../shares/constants/enum";

export const updateSettingBody = Joi.object({
    logo: Joi.string().required().messages({
        "string.empty": "Logo không được để trống",
        "any.required": "Logo là bắt buộc",
    }),
    name: Joi.string().required().messages({
        "string.empty": "Tên website không được để trống",
        "any.required": "Tên website là bắt buộc",
    }),
    company: Joi.string().required().messages({
        "string.empty": "Tên công ty không được để trống",
        "any.required": "Tên công ty là bắt buộc",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email không đúng định dạng",
        "string.empty": "Email không được để trống",
        "any.required": "Email là bắt buộc",
    }),
    address: Joi.string().required().messages({
        "string.empty": "Địa chỉ không được để trống",
        "any.required": "Địa chỉ là bắt buộc",
    }),
    hotline: Joi.string().required().messages({
        "string.empty": "Số hotline không được để trống",
        "any.required": "Số hotline là bắt buộc",
    }),
    workHours: Joi.string().allow("").messages({
        "string.base": "Giờ làm việc phải là chuỗi ký tự",
    }),
    social: Joi.object({
        facebook: Joi.string().uri().allow("").messages({
            "string.uri": "Link Facebook không hợp lệ",
        }),
        instagram: Joi.string().uri().allow("").messages({
            "string.uri": "Link Instagram không hợp lệ",
        }),
        tiktok: Joi.string().uri().allow("").messages({
            "string.uri": "Link Tiktok không hợp lệ",
        }),
        zalo: Joi.string().allow("").messages({
            "string.base": "Thông tin Zalo phải là chuỗi ký tự",
        }),
    }),
    banner: Joi.array().items(
        Joi.object({
            image: Joi.string().required().messages({
                "string.empty": "Ảnh banner không được để trống",
                "any.required": "Ảnh banner là bắt buộc",
            }),
            link: Joi.string().uri().allow("").messages({
                "string.uri": "Link điều hướng banner không hợp lệ",
            }),
            isActive: Joi.string()
                .valid(...Object.values(BaseStatusEnum))
                .messages({
                    "any.only": "Trạng thái banner không hợp lệ",
                }),
        })
    ).messages({
        "array.base": "Danh sách banner phải là một mảng",
    }),
    popup: Joi.array().items(
        Joi.object({
            image: Joi.string().required().messages({
                "string.empty": "Ảnh popup không được để trống",
                "any.required": "Ảnh popup là bắt buộc",
            }),
            link: Joi.string().uri().allow("").messages({
                "string.uri": "Link điều hướng popup không hợp lệ",
            }),
            isActive: Joi.string()
                .valid(...Object.values(BaseStatusEnum))
                .messages({
                    "any.only": "Trạng thái popup không hợp lệ",
                }),
        })
    ).messages({
        "array.base": "Danh sách popup phải là một mảng",
    }),
    metaTitle: Joi.string().max(70).allow("").messages({
        "string.max": "Tiêu đề SEO không nên vượt quá 70 ký tự",
    }),
    metaDescription: Joi.string().max(160).allow("").messages({
        "string.max": "Mô tả SEO không nên vượt quá 160 ký tự",
    }),
});