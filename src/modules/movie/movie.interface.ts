import mongoose from "mongoose";
import { IBaseDocument } from "../../shares/bases/baseDocument";
import { AgePermissionTypeEnum, MovieStatusEnum, SubtitleTypeEnum } from "../../shares/constants/enum";

interface IMovie extends IBaseDocument {
    _id?: mongoose.Types.ObjectId;
    name: string;
    duration: number;
    releaseDate: Date;
    director?: string;
    description: string;
    subtitle?: SubtitleTypeEnum[];
    poster: string;
    banner: string;
    trailer: string;
    actors: mongoose.Types.ObjectId[];
    categories: mongoose.Types.ObjectId[];
    nationality?: string;
    agePermission: AgePermissionTypeEnum;
    status: MovieStatusEnum;
    format?: string[];
    likes: mongoose.Types.ObjectId[];
    likeCount: number;
}

export type { IMovie };
