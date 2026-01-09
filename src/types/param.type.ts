import { BaseStatusEnum, DayOfWeekEnum } from "@/shares/constants/enum";

interface IPagintion {
    page?: number;
    limit?: number;
    totalPages?: number;
    totalItems?: number;
}

export type { IPagintion };

interface IUserQuery extends IPagintion {
    username?: string;
    role?: string;
    isBlocked?: string;
    sort?: string;
}
export type { IUserQuery };

interface IActorQuery extends IPagintion {
    name?: string;
    sort?: string;
}
export type { IActorQuery };

interface IMovieQuery extends IPagintion {
    name?: string;
    status?: string;
    releaseDate?: string;
    categoryIds?: string;
    agePermission?: string;
    sort?: string;
}
export type { IMovieQuery };

interface ICinemaQuery extends IPagintion {
    name?: string,
    province?: string
}

export type { ICinemaQuery };

interface IShowtimeQuery extends IPagintion {
    movieId?: string,
    roomId?: string,
    date?: Date,
    status?: BaseStatusEnum
    sort?: string
}

export type { IShowtimeQuery };


interface IRoomQuery extends IPagintion {
    name?: string,
    cinemaId?: string
}

export type { IRoomQuery };


interface IFoodQuery extends IPagintion {
    name?: string,
    minPrice?: number,
    maxPrice?: number
}

export type { IFoodQuery };

interface ITicketPriceQuery extends IPagintion {
    timeSlot?: string;
    ageType?: string;
    formatRoom?: string;
    dayOfWeek?: DayOfWeekEnum;
    minPrice?: string;
    maxPrice?: string;
}

export type { ITicketPriceQuery };

interface IAgeTypeQuery extends IPagintion {
    name?: string,
    age?: number
}

export type { IAgeTypeQuery };

interface IVoucherQuery extends IPagintion {
    name?: string;
    code?: string;
    status?: BaseStatusEnum,
    sort?: string
}

export type { IVoucherQuery };

interface IPermissionQuery extends IPagintion {
    name?: string;
    path?: string;
    method?: string,
    sort?: string
}

export type { IPermissionQuery };

interface IRoleQuery extends IPagintion {
    name?: string
}
export type { IRoleQuery };

interface IBlogQuery extends IPagintion {
    title?: string,
    isPublished?: string
}
export type { IBlogQuery };
