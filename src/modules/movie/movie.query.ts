import { Types } from "mongoose";
import { GetMovieListQuery } from "./movie.validation";
import { buildSort } from "../../utils/buidSort";

export function buildMovieQuery(query: GetMovieListQuery) {
    const filter: Record<string, any> = {
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

    if (query.categoryIds && query.categoryIds.length > 0) {
        const rawIds = Array.isArray(query.categoryIds)
            ? query.categoryIds
            : [query.categoryIds];

        const validObjectIds = rawIds
            .filter(id => Types.ObjectId.isValid(id))
            .map(id => new Types.ObjectId(id));

        // Nếu frontend gửi categoryIds nhưng KHÔNG CÓ ID HỢP LỆ
        if (validObjectIds.length === 0) {
            // ép không trả về gì
            filter._id = { $exists: false };
        } else {
            filter.categories = {
                $in: validObjectIds, // chỉ cần trùng 1 cái
            };
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