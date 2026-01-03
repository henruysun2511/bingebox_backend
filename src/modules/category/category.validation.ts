import Joi from "joi";

export const GetCategoryIdParam = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "ID danh mục là bắt buộc",
    "string.base": "ID không hợp lệ",
  }),
});

export const createCategoryBody = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "Tên danh mục phải là chuỗi ký tự",
      "string.empty": "Tên danh mục không được để trống",
      "string.min": "Tên danh mục phải có ít nhất 2 ký tự",
      "string.max": "Tên danh mục không được vượt quá 50 ký tự",
      "any.required": "Tên danh mục là bắt buộc",
    }),
});

export const updateCategoryBody = createCategoryBody
  .fork(["name"], (schema) => schema.optional())
  .min(1)
  .messages({
    "object.min": "Phải cập nhật ít nhất một trường",
  });