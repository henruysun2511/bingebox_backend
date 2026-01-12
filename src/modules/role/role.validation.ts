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
    permissions: Joi.array().items(Joi.string()).optional().default([]).messages({
        "array.base": "Danh sách quyền phải là một mảng (array)",
    })
});

export const updateRole = createRole.fork(
    Object.keys(createRole.describe().keys),
    (schema) => schema.optional()
).min(1);