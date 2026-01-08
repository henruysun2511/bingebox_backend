import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { PermissionMethodTypeEnum } from "../../shares/constants/enum";
import { IPermission } from "../../types/object.type";

const permissionSchema = new mongoose.Schema<IPermission>({
    ...baseFields,
    name: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    method: {
        type: String,
        required: true,
        enum: Object.values(PermissionMethodTypeEnum),
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

// Index để tìm kiếm nhanh và đảm bảo không trùng lặp cặp Path - Method
permissionSchema.index({ path: 1, method: 1, isDeleted: 1 }, { unique: true });

export default mongoose.model<IPermission>('Permission', permissionSchema);