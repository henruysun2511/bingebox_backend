import mongoose from "mongoose";
import { IMovieQuery } from "../../types/param.type";
import { buildSort } from "../../utils/buidSort";

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
        const rawIds = Array.isArray(query.categoryIds)
            ? query.categoryIds
            : [query.categoryIds];

        const validObjectIds = rawIds
            .filter(id => mongoose.Types.ObjectId.isValid(id))
            .map(id => new mongoose.Types.ObjectId(id));

        if (validObjectIds.length > 0) {
            filter.categories = { $in: validObjectIds };
        }
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