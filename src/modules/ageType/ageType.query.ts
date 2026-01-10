import { IAgeTypeQuery } from "../../types/param.type";

export function buildAgeTypeQuery(query: IAgeTypeQuery) {
    const filter: any = { isDeleted: false };

    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }

    if (query.age) {
        const age = Number(query.age);
        filter.minAge = { $lte: age };
        filter.maxAge = { $gte: age };
    }

    return { filter };
}