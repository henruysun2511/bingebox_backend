import Joi from "joi";
import { AgePermissionTypeEnum, MovieStatusEnum, SubtitleTypeEnum } from "../../shares/constants/enum";

export const getMovieListQuery = Joi.object({
  name: Joi.string().trim().optional(),
  status: Joi.string().valid(...Object.values(MovieStatusEnum)).optional(),
  categoryIds: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sort: Joi.string().optional(),
});

export const getMovieIdParam = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "ID phim là bắt buộc",
    "string.base": "ID phim không đúng định dạng",
  }),
});

export const createMovie = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tên phim không được để trống",
    "any.required": "Tên phim là bắt buộc",
  }),
  duration: Joi.number().min(1).required().messages({
    "number.base": "Thời lượng phải là số",
    "number.min": "Thời lượng phải lớn hơn 0",
    "any.required": "Thời lượng là bắt buộc",
  }),
  releaseDate: Joi.date().required().messages({
    "date.base": "Ngày phát hành không hợp lệ",
    "any.required": "Ngày phát hành là bắt buộc",
  }),
  director: Joi.string().allow("").optional(),
  description: Joi.string().required().messages({
    "string.empty": "Mô tả phim không được để trống",
    "any.required": "Mô tả phim là bắt buộc",
  }),
  subtitle: Joi.string().valid(...Object.values(SubtitleTypeEnum)).messages({
    "any.only": "Loại phụ đề không hợp lệ",
  }),
  poster: Joi.string().uri().required().messages({
    "string.uri": "Link poster không hợp lệ",
    "any.required": "Poster là bắt buộc",
  }),
  banner: Joi.string().uri().required().messages({
    "string.uri": "Link banner không hợp lệ",
    "any.required": "Banner là bắt buộc",
  }),
  trailer: Joi.string().uri().required().messages({
    "string.uri": "Link trailer không hợp lệ",
    "any.required": "Trailer là bắt buộc",
  }),
  actors: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "Phải có ít nhất một diễn viên",
    "any.required": "Danh sách diễn viên là bắt buộc",
  }),
  categories: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "Phải có ít nhất một thể loại",
    "any.required": "Danh sách thể loại là bắt buộc",
  }),
  nationality: Joi.string().allow("").optional(),
  agePermission: Joi.string().valid(...Object.values(AgePermissionTypeEnum)).required().messages({
    "any.only": "Độ tuổi cho phép không hợp lệ",
    "any.required": "Độ tuổi cho phép là bắt buộc",
  }),
  status: Joi.string().valid(...Object.values(MovieStatusEnum)).required().messages({
    "any.only": "Trạng thái phim không hợp lệ",
    "any.required": "Trạng thái phim là bắt buộc",
  }),
  format: Joi.array().items(Joi.string()).optional(),
});

export const updateMovie = createMovie.fork(
  Object.keys(createMovie.describe().keys),
  (schema) => schema.optional()
).min(1).messages({
  "object.min": "Phải có ít nhất một trường cần cập nhật",
});