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

