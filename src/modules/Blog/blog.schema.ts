import { IBlog } from "@/types/object.type";
import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";

const blogSchema = new mongoose.Schema<IBlog>({
  ...baseFields,
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // Lưu Rich Text HTML
  thumbnail: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IBlog>('Blog', blogSchema);