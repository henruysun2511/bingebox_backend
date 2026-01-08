import Joi from "joi";

export const getAgeTypeIdParam = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.length": "ID không hợp lệ",
        "any.required": "ID là bắt buộc",
    }),
});

export const createAgeTypeBody = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Tên đối tượng không được để trống",
        "any.required": "Tên đối tượng là bắt buộc",
    }),
    minAge: Joi.number().min(0).required().messages({
        "number.min": "Tuổi tối thiểu không được nhỏ hơn 0",
        "any.required": "Tuổi tối thiểu là bắt buộc",
    }),
    maxAge: Joi.number().min(Joi.ref('minAge')).required().messages({
        "number.min": "Tuổi tối đa phải lớn hơn hoặc bằng tuổi tối thiểu",
        "any.required": "Tuổi tối đa là bắt buộc",
    }),
});

export const updateAgeTypeBody = createAgeTypeBody.fork(
    Object.keys(createAgeTypeBody.describe().keys),
    (schema) => schema.optional()
).min(1).messages({
    "object.min": "Cần ít nhất một trường để cập nhật",
});