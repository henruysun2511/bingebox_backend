import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface IComment extends IBaseDocument {
    user: mongoose.Types.ObjectId;
    movie: mongoose.Types.ObjectId;
    content: string;
    rating: number;
    likesCount: number;
    replyCount: number;
    parent?: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
}

export type { IComment };
