import Joi from "joi";

export const getShowtimeQuery = Joi.object({
  movieId: Joi.string().optional(),
  roomId: Joi.string().optional(),
  date: Joi.date().optional(),
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).optional(),
  sort: Joi.string().optional(),
});

export const createShowtime = Joi.object({
  movie: Joi.string().required().messages({
    "any.required": "Phim là bắt buộc",
    "string.empty": "ID phim không được để trống",
  }),
  room: Joi.string().required().messages({
    "any.required": "Phòng chiếu là bắt buộc",
  }),
  startTime: Joi.string().required().messages({
    "any.required": "Giờ bắt đầu là bắt buộc",
  }),
});

export const updateShowtime = createShowtime.fork(
  ["movie", "room", "startTime"],
  (schema) => schema.optional()
).min(1).messages({
  "object.min": "Phải có ít nhất một trường cần cập nhật",
});


export const getScheduleParam = Joi.object({
    cinemaId: Joi.string().hex().length(24).required().messages({
        "any.required": "ID rạp là bắt buộc",
    }),
});

export const getScheduleQuery = Joi.object({
    date: Joi.date().iso().optional().messages({
        "date.format": "Ngày không đúng định dạng YYYY-MM-DD",
    }),
});
