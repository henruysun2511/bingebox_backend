import { GetActorListQuery } from "./actor.validation";
import { buildSort } from "../../utils/buidSort";

export function buildActorQuery(query: GetActorListQuery) {
    const filter: Record<string, any> = {
        isDeleted: false,
    };

    if (query.name) {
        filter.name = {
            $regex: query.name,
            $options: "i",
        };
    }

    if (query.alphabet) {
        filter.name = {
            $regex: `^\\s*${query.alphabet}`,
            $options: "i",
        };
    }

    const sort = buildSort(query.sort, ["name", "createdAt"]);

    return { filter, sort };
}