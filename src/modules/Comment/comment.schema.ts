import { IComment } from "@/types/object.type";
import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema<IComment>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, 
    content: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    replyCount: { type: Number, default: 0 }, // Giúp FE biết có bao nhiêu reply để hiện nút "Xem thêm"
    likes: [
        { type: Schema.Types.ObjectId, ref: "User" } 
    ],
}, { timestamps: true });

// Index để truy vấn nhanh danh sách bình luận theo phim
commentSchema.index({ movie: 1, parent: 1, createdAt: -1 });

export default mongoose.model<IComment>("Comment", commentSchema);