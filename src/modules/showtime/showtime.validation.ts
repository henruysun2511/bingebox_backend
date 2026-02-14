import Joi from "joi";
import { SubtitleTypeEnum } from "../../shares/constants/enum";

export const getShowtimeQuery = Joi.object({
  movieId: Joi.string().optional().allow(""),
  roomId: Joi.string().optional().allow(""),
  date: Joi.date().optional().allow(""),
  page: Joi.number().min(1).optional().allow(""),
  limit: Joi.number().min(1).optional().allow(""),
  sort: Joi.string().optional().allow(""),
});

export const getShowtimeIdParam = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "ID suất chiếu là bắt buộc",
    "string.base": "ID suất chiếu không đúng định dạng",
  }),
});

export const createShowtime = Joi.object({
  movie: Joi.string().required().messages({
    "any.required": "Phim là bắt buộc",
    "string.empty": "ID phim không được để trống",
  }),
  subtitle: Joi.string()
    .valid(...Object.values(SubtitleTypeEnum))
    .required()
    .messages({
      "string.base": "Phụ đề phải là định dạng chuỗi văn bản",
      "any.only": "Loại phụ đề không hợp lệ",
      "any.required": "Loại phụ đề là bắt buộc",
    }),
  room: Joi.string().required().messages({
    "any.required": "Phòng chiếu là bắt buộc",
  }),
  startTime: Joi.string()
    .isoDate()
    .required()
    .messages({
      "string.isoDate": "Thời gian phải đúng định dạng ISO (YYYY-MM-DDTHH:mm:ssZ)",
      "any.required": "Giờ bắt đầu là bắt buộc",
    }),
});

export const updateShowtime = createShowtime.fork(
  ["movie", "room", "startTime"],
  (schema) => schema.optional()
).min(1).messages({
  "object.min": "Phải có ít nhất một trường cần cập nhật",
});


export const getShowtimeByCinemaParam = Joi.object({
  cinemaId: Joi.string().hex().length(24).required().messages({
    "any.required": "ID rạp là bắt buộc",
  }),
});

export const getScheduleQuery = Joi.object({
  date: Joi.date().iso().optional().messages({
    "date.format": "Ngày không đúng định dạng YYYY-MM-DD",
  }),
});

export const getShowtimeByMovieParam = Joi.object({
  movieId: Joi.string().hex().length(24).required().messages({
    "string.length": "ID phim không hợp lệ",
    "any.required": "ID phim là bắt buộc"
  })
});
