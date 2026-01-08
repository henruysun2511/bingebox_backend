import Joi from "joi";
import { BaseStatusEnum } from "../../shares/constants/enum";

export const getVoucherListQuery = Joi.object({
    name: Joi.string().trim().optional(),
    code: Joi.string().trim().optional(),
    status: Joi.string().valid(...Object.values(BaseStatusEnum)).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    sort: Joi.string().optional(),
});

export const getVoucherIdParam = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "ID voucher là bắt buộc",
    }),
});

export const createVoucher = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Tên voucher không được để trống",
        "any.required": "Tên voucher là bắt buộc",
    }),
    code: Joi.string().uppercase().trim().required().messages({
        "string.empty": "Mã code không được để trống",
        "any.required": "Mã code là bắt buộc",
    }),
    description: Joi.string().allow("").optional(),
    startTime: Joi.date().required().messages({
        "any.required": "Ngày bắt đầu là bắt buộc",
    }),
    endTime: Joi.date().greater(Joi.ref('startTime')).required().messages({
        "date.greater": "Ngày kết thúc phải sau ngày bắt đầu",
        "any.required": "Ngày kết thúc là bắt buộc",
    }),
    minOrderValue: Joi.number().min(0).required().messages({
        "number.min": "Giá trị đơn hàng tối thiểu không được âm",
    }),
    maxDiscountAmount: Joi.number().min(0).required().messages({
        "number.min": "Số tiền giảm tối đa không được âm",
    }),
    maxUsage: Joi.number().integer().min(1).required().messages({
        "number.min": "Số lần sử dụng tối đa phải ít nhất là 1",
    }),
    status: Joi.string().valid(...Object.values(BaseStatusEnum)).required().messages({
        "any.only": "Trạng thái không hợp lệ",
    }),
});

export const updateVoucher = createVoucher.fork(
    Object.keys(createVoucher.describe().keys),
    (schema) => schema.optional()
).min(1).messages({
    "object.min": "Phải có ít nhất một trường cần cập nhật",
});