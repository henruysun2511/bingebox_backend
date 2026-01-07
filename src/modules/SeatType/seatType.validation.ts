import Joi from "joi";

export const getSeatTypeIdParam = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "any.required": "ID loại ghế là bắt buộc",
    "string.length": "ID loại ghế không hợp lệ",
  }),
});

export const createSeatType = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tên loại ghế không được để trống",
    "any.required": "Tên loại ghế là bắt buộc",
  }),
  color: Joi.string().trim().required().messages({
    "string.empty": "Mã màu không được để trống",
    "any.required": "Mã màu là bắt buộc",
  }),
});

export const updateSeatType = createSeatType.fork(
  Object.keys(createSeatType.describe().keys),
  (schema) => schema.optional()
).min(1).messages({
  "object.min": "Phải có ít nhất một trường cần cập nhật",
});