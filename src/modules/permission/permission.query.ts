import { GetPermissionListQuery } from "./permission.validation";
import { buildSort } from "../../utils/buidSort";

export function buildPermissionQuery(query: GetPermissionListQuery) {
    const filter: Record<string, any> = {
        isDeleted: false,
    };

    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }

    if (query.path) {
        filter.path = { $regex: query.path, $options: "i" };
    }

    if (query.method) {
        filter.method = query.method;
    }

    const sort = buildSort(query.sort, ["name", "createdAt"]);
    
    return { filter, sort };
}