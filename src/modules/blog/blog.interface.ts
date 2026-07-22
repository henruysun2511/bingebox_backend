import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";

interface IBlog extends IBaseDocument {
    title: string;
    slug: string;
    content: string;
    thumbnail?: string;
    author: mongoose.Types.ObjectId;
    views: number;
    isPublished: boolean;
}

export type { IBlog };
