import { AgePermissionTypeEnum, BaseStatusEnum, DayOfWeekEnum, GenderEnum, MovieStatusEnum, PermissionMethodTypeEnum, SeatLayoutTypeEnum, SubtitleTypeEnum } from "@/shares/constants/enum";
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

interface IRoomBody {
    name: string,
    cinema: mongoose.Types.ObjectId,
    format: mongoose.Types.ObjectId,
    status: BaseStatusEnum;
    seatLayout: {
        type: SeatLayoutTypeEnum;
        rows?: number;
        columns?: number;
        width?: number;
        height?: number;
    };
}
export type { IRoomBody };

interface ISeatBody {
    code: string;

    row?: number;
    column?: number;

    position?: {
        x: number;
        y: number;
    };
    isBlocked?: boolean; //ô trống?
    seatType: mongoose.Types.ObjectId;
    isCoupleSeat?: boolean; //ghế đôi?
    coupleId?: string;
}
export type { ISeatBody };

interface ISeatTypeBody {
    name: string,
    color: string
}
export type { ISeatTypeBody };

interface IFoodBody {
    name: string,
    price: number,
    image: string
}

export type { IFoodBody };

interface ITicketPriceBody {
    timeSlot: mongoose.Types.ObjectId,
    ageType: mongoose.Types.ObjectId,
    formatRoom: mongoose.Types.ObjectId,
    seatType: mongoose.Types.ObjectId,
    dayOfWeek: DayOfWeekEnum,
    finalPrice: number
}

export type { ITicketPriceBody };

interface IBookingBody {
    showtimeId: string,
    seatIds: string[],
    foods: [
        {
            foodId: string,
            quantity: number
        }
    ],
    voucherCode: string,
    pointsUsed: number
}
export type { IBookingBody };

interface IAgeTypebody {
    name: string,
    minAge: number,
    maxAge: number
}
export type { IAgeTypebody };

interface IMembershipBody {
    name: string;
    minSpending: number;
    pointAccumulationRate: number;
    discountRate: number;
}
export type { IMembershipBody };

interface IPermissionBody {
    name: string,
    path: string,
    method: PermissionMethodTypeEnum,
    description?: string
}
export type { IPermissionBody };

interface IRoleBody {
    name: string,
    description?: string,
    permissions: mongoose.Types.ObjectId[];
}

export type { IRoleBody };

