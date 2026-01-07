import Joi from "joi";

export const updateSeatSchema = {
    params: Joi.object({
        roomId: Joi.string().hex().length(24).required().messages({
            "string.length": "ID phòng không hợp lệ",
            "any.required": "ID phòng là bắt buộc",
        }),
    }),
    body: Joi.object({
        seats: Joi.array().items(
            Joi.object({
                code: Joi.string().required().messages({
                    "any.required": "Mã ghế là bắt buộc",
                    "string.empty": "Mã ghế không được để trống",
                }),
                row: Joi.number().integer().min(1).optional(),
                column: Joi.number().integer().min(1).optional(),
                isBlocked: Joi.boolean().default(false),
                seatTypeId: Joi.string().hex().length(24).required().messages({
                    "any.required": "Loại ghế là bắt buộc",
                    "string.length": "ID loại ghế không hợp lệ",
                }),
                isCoupleSeat: Joi.boolean().default(false),
                position: Joi.object({
                    x: Joi.number().required(),
                    y: Joi.number().required(),
                }).optional(),
                partnerSeatId: Joi.string().hex().length(24).allow(null).optional(),
            })
        ).min(1).required().messages({
            "array.min": "Phải có ít nhất một ghế trong sơ đồ",
            "any.required": "Dữ liệu ghế là bắt buộc",
        }),
    }),
};

export const getSeatsByRoomParam = Joi.object({
    roomId: Joi.string().hex().length(24).required().messages({
        "string.length": "ID phòng không hợp lệ",
        "any.required": "ID phòng là bắt buộc",
    }),
});
