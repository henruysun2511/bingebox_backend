import Joi from "joi";
import { GenderEnum } from "../../shares/constants/enum";

export const GetActorListQuery = Joi.object({
  name: Joi.string().trim().allow("").optional(),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page phải là số",
    }),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sort: Joi.string().valid("name", "-name", "createdAt", "-createdAt").default("-createdAt"),
});

export const GetActorIdParam = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "ID là bắt buộc",
  }),
});

export const createActorBody = Joi.object({
  name: Joi.string()
    .min(2)
    .required()
    .messages({
      "string.base": "Tên diễn viên phải là chuỗi",
      "string.min": "Tên diễn viên phải có ít nhất 2 ký tự",
      "any.required": "Tên diễn viên là bắt buộc",
    }),

  avatar: Joi.string()
    .uri()
    .required()
    .messages({
      "string.uri": "Avatar phải là một URL hợp lệ",
      "any.required": "Avatar là bắt buộc",
    }),

  bio: Joi.string()
    .optional()
    .messages({
      "string.base": "Tiểu sử phải là chuỗi",
    }),

  nationality: Joi.string()
    .optional()
    .messages({
      "string.base": "Quốc tịch phải là chuỗi",
    }),
  gender: Joi.string()
    .valid(...Object.values(GenderEnum))
    .optional()
    .messages({
      "any.only": "Giới tính không hợp lệ",
    })
});

//Actor sẽ kế thừa từ createActor và không bắt buộc gửi các trường
export const updateActorBody = createActorBody
  .fork(["name"], schema => schema.optional())
  .min(1)
  .messages({
    "object.min": "Phải cập nhật ít nhất một trường",
  });