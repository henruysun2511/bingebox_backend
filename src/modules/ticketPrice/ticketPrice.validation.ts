import Joi from "joi";
import { DayOfWeekEnum } from "../../shares/constants/enum";

const objectIdCustom = Joi.string().hex().length(24).messages({
    "string.hex": "ID phải là định dạng hexadecimal",
    "string.length": "ID phải đúng 24 ký tự",
});

export const ticketPriceIdParam = Joi.object({
    id: objectIdCustom.required().messages({
        "any.required": "ID cấu hình giá là bắt buộc"
    }),
});

export const createTicketPriceBody = Joi.object({
    timeSlot: objectIdCustom.required().messages({
        "any.required": "Khung giờ chiếu (TimeSlot) là bắt buộc",
    }),
    ageType: objectIdCustom.required().messages({
        "any.required": "Loại độ tuổi là bắt buộc",
    }),
    formatRoom: objectIdCustom.required().messages({
        "any.required": "Định dạng phòng chiếu là bắt buộc",
    }),
    seatType: objectIdCustom.required().messages({
        "any.required": "Loại ghế là bắt buộc",
    }),
    dayOfWeek: Joi.string().valid(...Object.values(DayOfWeekEnum)).required().messages({
        "any.only": "Ngày trong tuần không hợp lệ",
        "any.required": "Ngày trong tuần là bắt buộc",
    }),
    finalPrice: Joi.number().min(0).required().messages({
        "number.base": "Giá vé phải là một số",
        "number.min": "Giá vé không được nhỏ hơn 0",
        "any.required": "Giá vé là bắt buộc",
    }),
});

// Tự động tạo update validation từ create validation
export const updateTicketPriceBody = createTicketPriceBody.fork(
    Object.keys(createTicketPriceBody.describe().keys),
    (schema) => schema.optional()
).min(1).messages({
    "object.min": "Cần ít nhất một trường để cập nhật",
});

export const ticketPriceListQuery = Joi.object({
    timeSlot: objectIdCustom.optional(),
    ageType: objectIdCustom.optional(),
    formatRoom: objectIdCustom.optional(),
    seatType: objectIdCustom.optional(),
    dayOfWeek: Joi.string().valid(...Object.values(DayOfWeekEnum)).optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
});