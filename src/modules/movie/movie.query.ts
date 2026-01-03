import { IMovieQuery } from "@/types/param.type";
import { buildSort } from "@/utils/buidSort";

export function buildMovieQuery(query: IMovieQuery) {
    const filter: any = {
        isDeleted: false,
    };
    if (query.name) {
        filter.name = {
            $regex: query.name,
            $options: "i",
        };
    }
    if (query.status) {
        filter.status = query.status;
    }
    if (query.categoryIds) {
        filter.categories = query.categoryIds;
    }
    if (query.agePermission) {
        filter.agePermission = query.agePermission;
    }
    if (query.releaseDate) {
        filter.releaseDate = query.releaseDate;
    }
    const sort = buildSort(query.sort, ["name", "releaseDate", "createdAt"]);
    return { filter, sort };
}   