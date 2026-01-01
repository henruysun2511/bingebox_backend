import { IActorQuery } from "../../types/param.type";
import { buildSort } from "../../utils/buidSort";

export function buildActorQuery(query: IActorQuery) {
    const filter: any = {
        isDeleted: false,
    };

    if (query.name) {
        filter.name = {
            $regex: query.name,
            $options: "i",
        };
    }

    const sort = buildSort(query.sort, ["name", "createdAt"]);

    return { filter, sort };
}