import { AppError } from "@/utils/appError";
import mongoose from "mongoose";
import { buildPagination } from "../../utils/buildPagination";
import CommentModel from "./comment.schema";

export class CommentService {
    private commentModel = CommentModel;


    async createComment(data: any, userId: string) {
        const { parent, movie, content, rating } = data;

        const newComment = await this.commentModel.create({
            user: userId,
            movie,
            content,
            rating,
            parent: parent || null
        });

        // Nếu là reply, tăng replyCount của bình luận cha
        if (parent) {
            await this.commentModel.findByIdAndUpdate(parent, { $inc: { replyCount: 1 } });
        }

        return await newComment.populate("user", "username avatar");
    }

    // Lấy danh sách bình luận gốc (Phân trang)
    async getRootComments(movieId: string, query: any) {
        const { page, limit, skip } = buildPagination(query);
        const filter = { movie: movieId, parentId: null, isDeleted: false };

        const [items, total] = await Promise.all([
            this.commentModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("user", "fullName avatar")
                .lean(),
            this.commentModel.countDocuments(filter),
        ]);

        return {
            items,
            pagination: { page, limit, totalItems: total, totalPages: Math.ceil(total / limit) }
        };
    }

    // Lấy danh sách Reply của 1 bình luận (Xem thêm)
    async getReplies(parentId: string, query: any) {
        const { page, limit, skip } = buildPagination(query);
        const filter = { parentId, isDeleted: false };

        const [items, total] = await Promise.all([
            this.commentModel
                .find(filter)
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(limit)
                .populate("user", "fullName avatar")
                .lean(),
            this.commentModel.countDocuments(filter),
        ]);

        return {
            items,
            pagination: { page, limit, totalItems: total, totalPages: Math.ceil(total / limit) }
        };
    }

    async updateComment(id: string, userId: string, content: string) {
        const comment = await this.commentModel.findOne({ _id: id, isDeleted: false });

        if (!comment) throw new AppError("Không tìm thấy bình luận", 404);
        if (comment.user.toString() !== userId) {
            throw new AppError("Bạn không có quyền sửa bình luận này", 403);
        }

        comment.content = content;
        return await comment.save();
    }


    async deleteComment(id: string, userId: string) {
        const comment = await this.commentModel.findOne({ _id: id, isDeleted: false });

        if (!comment) throw new AppError("Không tìm thấy bình luận", 404);

        if (comment.user.toString() !== userId) {
            throw new AppError("Bạn không có quyền xóa bình luận này", 403);
        }

        comment.isDeleted = true;
        await comment.save();

        // Nếu là reply, giảm replyCount của cha
        if (comment.parent) {
            await this.commentModel.findByIdAndUpdate(comment.parent, { $inc: { replyCount: -1 } });
        }

        return { id };
    }

    async toggleLike(id: string, userId: string) {
        const comment = await this.commentModel.findOne({ _id: id, isDeleted: false });
        if (!comment) throw new AppError("Không tìm thấy bình luận", 404);

        const userObjectId = new mongoose.Types.ObjectId(userId);
        // Kiểm tra xem user đã like chưa
        const isLiked = (comment as any).likes?.includes(userObjectId);

        const updateQuery = isLiked
            ? { $pull: { likes: userObjectId } } // Nếu rồi thì bỏ like
            : { $addToSet: { likes: userObjectId } }; // Nếu chưa thì thêm vào

        const updatedComment = await this.commentModel.findByIdAndUpdate(
            id,
            updateQuery,
            { new: true }
        ).select("likes").lean();

        return {
            isLiked: !isLiked,
            likesCount: updatedComment?.likes?.length || 0
        };
    }
}