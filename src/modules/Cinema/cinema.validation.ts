import Joi from "joi";

export const getCinemaListQuery = Joi.object({
  name: Joi.string().optional(),
  province: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sort: Joi.string().optional(),
});

export const getCinemaIdParam = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "ID rạp là bắt buộc",
    "string.base": "ID rạp không đúng định dạng",
  }),
});

export const createCinema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Tên rạp là bắt buộc",
  }),
  location: Joi.string().required().messages({
    "any.required": "Địa chỉ rạp là bắt buộc",
  }),
  province: Joi.string().required().messages({
    "any.required": "Tỉnh/Thành phố là bắt buộc",
  }),
  description: Joi.string().allow("").optional(),
  image: Joi.string().uri().allow("").optional(),
});

export const updateCinema = createCinema.fork(
  Object.keys(createCinema.describe().keys),
  (schema) => schema.optional()
).min(1).messages({
  "object.min": "Phải có ít nhất một trường cần cập nhật",
});