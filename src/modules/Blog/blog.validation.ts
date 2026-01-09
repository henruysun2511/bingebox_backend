import Joi from "joi";

const objectIdCustom = Joi.string().hex().length(24).messages({
    "string.hex": "ID phải là định dạng hexadecimal",
    "string.length": "ID phải đúng 24 ký tự",
});

export const blogIdParam = Joi.object({
    id: objectIdCustom.required().messages({
        "any.required": "ID bài viết là bắt buộc"
    }),
});

export const createBlogBody = Joi.object({
    title: Joi.string().min(10).required().messages({
        "string.empty": "Tiêu đề không được để trống",
        "string.min": "Tiêu đề phải có ít nhất 10 ký tự",
        "any.required": "Tiêu đề là bắt buộc",
    }),
    content: Joi.string().required().messages({
        "string.empty": "Nội dung bài viết không được để trống",
        "any.required": "Nội dung là bắt buộc",
    }),
    thumbnail: Joi.string().uri().optional().messages({
        "string.uri": "Thumbnail phải là một đường dẫn URL hợp lệ",
    }),
    isPublished: Joi.boolean().optional()
});

export const updateBlogBody = createBlogBody.fork(
    Object.keys(createBlogBody.describe().keys),
    (schema) => schema.optional()
).min(1).messages({
    "object.min": "Cần ít nhất một trường để cập nhật",
});

export const blogListQuery = Joi.object({
    search: Joi.string().optional(),
    isPublished: Joi.boolean().optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional()
});