import Joi from "joi";

export const getFoodIdParam = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.length": "ID món ăn không hợp lệ",
    "any.required": "ID món ăn là bắt buộc",
  }),
});

export const getFoodListQuery = Joi.object({
  name: Joi.string().trim().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
});

export const createFoodBody = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tên món ăn không được để trống",
    "any.required": "Tên món ăn là bắt buộc",
  }),
  image: Joi.string().uri().required().messages({
    "string.uri": "Link ảnh không đúng định dạng",
    "any.required": "Ảnh món ăn là bắt buộc",
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "Giá tiền không được nhỏ hơn 0",
    "any.required": "Giá tiền là bắt buộc",
  }),
});

export const updateFoodBody = createFoodBody.fork(
  Object.keys(createFoodBody.describe().keys),
  (schema) => schema.optional()
).min(1).messages({
  "object.min": "Phải có ít nhất một trường cần cập nhật",
});