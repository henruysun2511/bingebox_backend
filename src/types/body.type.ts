import { AgePermissionTypeEnum, BaseStatusEnum, GenderEnum, MovieStatusEnum, SubtitleTypeEnum } from "@/shares/constants/enum";
import mongoose from "mongoose";

interface IActorBody {
    name: string;
    bio?: string;
    avatar: string;
    nationality?: string;
    gender?: GenderEnum;
}

export type { IActorBody };

interface IRegisterBody {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    avatar?: string;
    birth?: Date;
}
export type { IRegisterBody };

interface ILoginBody {
    username: string;
    password: string;
}
export type { ILoginBody };

interface IChangePasswordBody {
    oldPassword: string;
    newPassword: string;
}

export type { IChangePasswordBody };

interface IUserBody {
    fullName?: string;
    avatar?: string;
    gender?: string;
    birth?: Date;
}

export type { IUserBody };

interface IMovieBody {
    name: string;
    duration: number;
    releaseDate: Date;
    director?: string;
    description: string;
    poster: string;
    banner: string;
    trailer: string;
    actors: mongoose.Types.ObjectId[];
    categories: mongoose.Types.ObjectId[];
    nationality?: string;
    agePermission: AgePermissionTypeEnum;
    status: MovieStatusEnum;
    subtitle?: SubtitleTypeEnum;
    format?: string[];
}
export type { IMovieBody };

interface ICinemaBody {
    name: string,
    location: string,
    description?: string,
    image?: string,
    province?: string
}

export type { ICinemaBody };

interface IShowtimeBody {
    movie: mongoose.Types.ObjectId;
    room: mongoose.Types.ObjectId;
    startTime: Date
    endTime: Date
    status: BaseStatusEnum
    timeslot: mongoose.Types.ObjectId;
}

export type { IShowtimeBody };

interface ITimeSlotBody {
    name: string,
    startTime: string,
    endTime: string
}
export type { ITimeSlotBody };

