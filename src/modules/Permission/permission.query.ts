import { IPermissionQuery } from "@/types/param.type";
import { buildSort } from "../../utils/buidSort";

export function buildPermissionQuery(query: IPermissionQuery) {
    const filter: any = {
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