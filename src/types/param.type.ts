import { BaseStatusEnum } from "@/shares/constants/enum";

interface IPagintion {
    page?: number;
    limit?: number;
    totalPages?: number;
    totalItems?: number;
}

export type { IPagintion };


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

