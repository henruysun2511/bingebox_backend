import { AgePermissionTypeEnum, GenderEnum, LoginTypeEnum, MovieStatusEnum, SubtitleTypeEnum } from "@/shares/constants/enum";
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

interface IMovie extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string;
    duration: number;
    releaseDate: Date;
    director?: string;
    description: string;
    subtitle?: SubtitleTypeEnum;
    poster: string;
    banner: string;
    trailer: string;
    actors: mongoose.Types.ObjectId[];
    categories: mongoose.Types.ObjectId[];
    nationality?: string;
    agePermission: AgePermissionTypeEnum;
    status: MovieStatusEnum;
    format?: string[];
}

export type { IMovie };

