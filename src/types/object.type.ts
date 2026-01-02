import { GenderEnum, LoginTypeEnum } from "@/shares/constants/enum";
import mongoose from "mongoose";
import { IBaseDocument } from "../shares/bases/baseDocument";

interface IUser extends IBaseDocument {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password?: string;
    fullName?: string;
    avatar?: string;
    birth?: Date;
    gender?: GenderEnum;
    googleId?: string;
    provider?: LoginTypeEnum;
    role: string;
}

export type { IUser };

interface ISession extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
}
export type { ISession };

interface IActor extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string; 
    bio?: string; 
    avatar: string; 
    nationality?: string;
    gender?: GenderEnum; 
}
export type { IActor };

interface ICategory extends IBaseDocument {
    _id: mongoose.Types.ObjectId;
    name: string;
}
export type { ICategory };

