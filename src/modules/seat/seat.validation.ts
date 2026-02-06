import Joi from "joi";

export const updateSeatSchema = {
    params: Joi.object({
        roomId: Joi.string().hex().length(24).required()
    }),

    body: Joi.object({
        seats: Joi.array().items(
            Joi.object({
                code: Joi.string().required(),

                row: Joi.string()
                    .pattern(/^[A-Z]$/)
                    .required()
                    .messages({
                        "string.pattern.base": "Row phải là chữ cái A-Z"
                    }),

                column: Joi.number()
                    .integer()
                    .min(1)
                    .allow(null)
                    .required(),

                isBlocked: Joi.boolean().default(false),

                seatTypeId: Joi.when("isBlocked", {
                    is: true,
                    then: Joi.forbidden(),
                    otherwise: Joi.string().hex().length(24).required()
                }),

                isCoupleSeat: Joi.boolean().default(false),

                partnerSeatCode: Joi.when("isCoupleSeat", {
                    is: true,
                    then: Joi.string().required(),
                    otherwise: Joi.forbidden()
                })
            })
        ).min(1).required()
    }).prefs({ abortEarly: false })
};

export const getSeatsByRoomParam = Joi.object({
    roomId: Joi.string().hex().length(24).required().messages({
        "string.length": "ID phòng không hợp lệ",
        "any.required": "ID phòng là bắt buộc",
    }),
});

export const getSeatsByShowtimeParam = Joi.object({
    roomId: Joi.string().hex().length(24).required().messages({
        "string.length": "ID suất chiếu không hợp lệ",
        "any.required": "ID suất chiếu là bắt buộc",
    }),
});
