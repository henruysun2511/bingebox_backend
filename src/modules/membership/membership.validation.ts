import Joi from "joi";

export const getMembershipIdParam = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.length": "ID hạng thành viên không hợp lệ",
        "any.required": "ID hạng thành viên là bắt buộc",
    }),
});

export const createMembershipBody = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Tên hạng không được để trống",
        "any.required": "Tên hạng là bắt buộc",
    }),
    minSpending: Joi.number().min(0).required().messages({
        "number.min": "Chi tiêu tối thiểu không được nhỏ hơn 0",
        "any.required": "Chi tiêu tối thiểu là bắt buộc",
    }),
    pointAccumulationRate: Joi.number().min(0).max(1).required().messages({
        "number.min": "Tỷ lệ tích điểm từ 0 đến 1",
        "number.max": "Tỷ lệ tích điểm từ 0 đến 1",
        "any.required": "Tỷ lệ tích điểm là bắt buộc",
    }),
    discountRate: Joi.number().min(0).max(1).required().messages({
        "number.min": "Tỷ lệ giảm giá từ 0 đến 1",
        "number.max": "Tỷ lệ giảm giá từ 0 đến 1",
        "any.required": "Tỷ lệ giảm giá là bắt buộc",
    }),
});

export const updateMembershipBody = createMembershipBody.fork(
    Object.keys(createMembershipBody.describe().keys),
    (schema) => schema.optional()
).min(1).messages({
    "object.min": "Cần ít nhất một trường để cập nhật",
});