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

