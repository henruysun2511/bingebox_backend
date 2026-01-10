import Joi from "joi";
import { PermissionMethodTypeEnum } from "../../shares/constants/enum";

export const getPermissionListQuery = Joi.object({
    name: Joi.string().trim().optional(),
    path: Joi.string().trim().optional(),
    method: Joi.string().valid(...Object.values(PermissionMethodTypeEnum)).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    sort: Joi.string().optional(),
});

export const getPermissionIdParam = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "ID quyền hạn là bắt buộc",
    }),
});

export const createPermission = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Tên quyền hạn không được để trống",
        "any.required": "Tên quyền hạn là bắt buộc",
    }),
    path: Joi.string().trim().required().messages({
        "string.empty": "Đường dẫn (Path) không được để trống",
        "any.required": "Đường dẫn là bắt buộc",
    }),
    method: Joi.string().valid(...Object.values(PermissionMethodTypeEnum)).required().messages({
        "any.only": "Phương thức (Method) không hợp lệ",
        "any.required": "Phương thức là bắt buộc",
    }),
    description: Joi.string().allow("").optional(),
});

export const updatePermission = createPermission.fork(
    Object.keys(createPermission.describe().keys),
    (schema) => schema.optional()
).min(1).messages({
    "object.min": "Phải có ít nhất một trường cần cập nhật",
});