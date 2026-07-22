import { buildSort } from "../../utils/buidSort";

export function buildCinemaQuery(query: Record<string, any>) {
    const filter: Record<string, any> = {
        isDeleted: false,
    };

    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }

    if (query.province) {
        filter.province = query.province;
    }

    const sort = buildSort(query.sort, ["name", "createdAt"]);
    return { filter, sort };
}