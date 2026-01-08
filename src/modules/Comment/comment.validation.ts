import Joi from "joi";

export const createComment = Joi.object({
    movie: Joi.string().hex().length(24).required().messages({
        "string.hex": "ID phim không đúng định dạng",
        "string.length": "ID phim phải đủ 24 ký tự",
        "any.required": "Phim là bắt buộc"
    }),
    content: Joi.string().min(1).max(500).required().messages({
        "string.empty": "Nội dung bình luận không được để trống",
        "string.min": "Nội dung bình luận phải có ít nhất 1 ký tự",
        "string.max": "Bình luận không được vượt quá 500 ký tự",
        "any.required": "Nội dung bình luận là bắt buộc"
    }),
    rating: Joi.number().min(1).max(5).optional().messages({
        "number.min": "Đánh giá thấp nhất là 1 sao",
        "number.max": "Đánh giá cao nhất là 5 sao",
        "number.base": "Đánh giá phải là một số"
    }),
    parent: Joi.string().hex().length(24).optional().messages({
        "string.hex": "ID bình luận cha không đúng định dạng",
        "string.length": "ID bình luận cha phải đủ 24 ký tự"
    }),
});


export const updateComment = Joi.object({
    content: createComment.extract('content')
}).messages({
    "object.unknown": "Chỉ được phép cập nhật nội dung bình luận"
});


export const getCommentParams = Joi.object({
    movieId: Joi.string().hex().length(24).required().messages({
        "string.hex": "ID phim không hợp lệ",
        "any.required": "Thiếu ID phim"
    }),
});

export const commentIdParam = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.hex": "ID bình luận không hợp lệ",
        "any.required": "Thiếu ID bình luận"
    })
});