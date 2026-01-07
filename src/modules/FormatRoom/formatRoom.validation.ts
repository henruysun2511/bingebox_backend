import Joi from "joi";

export const getFormatRoomIdParam = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "ID định dạng là bắt buộc",
    }),
});

export const createFormatRoom = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Tên định dạng không được để trống",
        "any.required": "Tên định dạng là bắt buộc",
    }),
    description: Joi.string().allow("").optional(),
    image: Joi.string().uri().allow("").optional().messages({
        "string.uri": "Link ảnh không hợp lệ",
    }),
});

export const updateFormatRoom = createFormatRoom.fork(
    ["name"], 
    (schema) => schema.optional()
).min(1);



