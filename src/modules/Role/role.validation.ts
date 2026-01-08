import Joi from "joi";

export const getRoleListQuery = Joi.object({
    name: Joi.string().trim().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
});

export const getRoleIdParam = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "ID vai trò là bắt buộc",
    }),
});

export const createRole = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Tên vai trò không được để trống",
        "any.required": "Tên vai trò là bắt buộc",
    }),
    description: Joi.string().allow("").optional(),
    permissions: Joi.array().items(Joi.string()).min(1).required().messages({
        "array.min": "Phải gán ít nhất một quyền cho vai trò này",
        "any.required": "Danh sách quyền là bắt buộc",
    }),
});

export const updateRole = createRole.fork(
    Object.keys(createRole.describe().keys),
    (schema) => schema.optional()
).min(1);