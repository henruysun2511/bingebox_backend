import { GetAgeTypeQuery } from "./ageType.validation";

export function buildAgeTypeQuery(query: GetAgeTypeQuery) {
    const filter: Record<string, any> = { isDeleted: false };

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