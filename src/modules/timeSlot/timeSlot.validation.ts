import Joi from "joi";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createTimeSlot = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Tên khung giờ không được để trống",
        "any.required": "Tên khung giờ là bắt buộc",
    }),
    startTime: Joi.string().regex(timeRegex).required().messages({
        "string.pattern.base": "Giờ bắt đầu phải theo định dạng HH:mm (VD: 08:00)",
        "any.required": "Giờ bắt đầu là bắt buộc",
    }),
    endTime: Joi.string().regex(timeRegex).required().messages({
        "string.pattern.base": "Giờ kết thúc phải theo định dạng HH:mm (VD: 12:00)",
        "any.required": "Giờ kết thúc là bắt buộc",
    }),
});

export const updateTimeSlot = createTimeSlot.fork(
    ["name", "startTime", "endTime"], 
    (schema) => schema.optional()
);

export const getTimeSlotQuery = Joi.object({
    name: Joi.string().optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});