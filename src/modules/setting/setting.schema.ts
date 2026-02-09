import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { BaseStatusEnum } from "../../shares/constants/enum";
import { ISetting } from "../../types/object.type";

const settingSchema = new mongoose.Schema<ISetting>({
    ...baseFields,
    logo: { type: String, required: true },
    name: { type: String, required: true }, // Tên website
    company: { type: String, required: true }, // Tên công ty chủ quản
    email: { type: String, required: true },
    address: { type: String, required: true },
    hotline: { type: String, required: true },
    workHours: { type: String },
    social: {
        facebook: String,
        instagram: String,
        tiktok: String,
        zalo: String,
    },
    banner: [{ type: String }], // Danh sách link ảnh banner slider
    popup: [
        {
            image: String,
            link: String, // Nên có link khi click vào popup
            isActive: { 
                type: String, 
                enum: Object.values(BaseStatusEnum), 
                default: BaseStatusEnum.INACTIVE 
            }
        }
    ],
    // Bổ sung SEO
    metaTitle: String,
    metaDescription: String,
}, { timestamps: true });

export default mongoose.model<ISetting>('Setting', settingSchema);