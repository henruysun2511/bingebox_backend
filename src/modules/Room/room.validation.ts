import Joi from "joi";
import { SeatLayoutTypeEnum } from "../../shares/constants/enum";

export const getRoomListQuery = Joi.object({
  cinemaId: Joi.string().hex().length(24).optional().messages({
    "string.length": "ID rạp không hợp lệ",
  }),
  name: Joi.string().trim().optional(),
});

export const getRoomIdParam = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "any.required": "ID phòng là bắt buộc",
  }),
});


export const createRoomBody = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tên phòng không được để trống",
    "any.required": "Tên phòng là bắt buộc",
  }),
  cinema: Joi.string().hex().length(24).required().messages({
    "any.required": "Rạp phim là bắt buộc",
  }),
  format: Joi.string().hex().length(24).required().messages({
    "any.required": "Định dạng phòng là bắt buộc",
  }),
  seatLayout: Joi.object({
    type: Joi.string().valid(...Object.values(SeatLayoutTypeEnum)).required().messages({
      "any.only": "Loại sơ đồ không hợp lệ",
    }),
    rows: Joi.number().when("type", { is: SeatLayoutTypeEnum.GRID, then: Joi.required() }).messages({
      "any.required": "Số hàng là bắt buộc đối với sơ đồ lưới",
    }),
    columns: Joi.number().when("type", { is: SeatLayoutTypeEnum.GRID, then: Joi.required() }).messages({
      "any.required": "Số cột là bắt buộc đối với sơ đồ lưới",
    }),
  }).required(),
});

export const updateRoomBody = createRoomBody
  .fork(
    ["name", "cinema", "format", "seatLayout"],
    (schema) => schema.optional()
  )
  .min(1)
  .messages({
    "object.min": "Phải có ít nhất một trường cần cập nhật",
  });