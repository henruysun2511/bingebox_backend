import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { GenderEnum, LoginTypeEnum } from "../../shares/constants/enum";
import { IUser } from "../../types/object.type";

const userSchema = new mongoose.Schema<IUser>({
    ...baseFields,
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    fullName: {
        type: String,
        trim: true
    },
    avatar: String,
    birth: Date,
    gender: {
        type: String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.OTHER,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    provider: {
        type: String,
        enum: Object.values(LoginTypeEnum),
        default: LoginTypeEnum.LOCAL,
    },
},
    {
        timestamps: true,
        //Không trả về mật khẩu
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                return ret;
            },
        },
    });

export default mongoose.model<IUser>('User', userSchema);