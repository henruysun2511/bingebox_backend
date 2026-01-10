import { IVoucherQuery } from "../../types/param.type";
import { buildSort } from "../../utils/buidSort";

export function buildVoucherQuery(query: IVoucherQuery) {
    const filter: any = {
        isDeleted: false,
    };

    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }

    if (query.code) {
        filter.code = { $regex: query.code, $options: "i" };
    }

    if (query.status) {
        filter.status = query.status;
    }

    const sort = buildSort(query.sort, ["name", "startTime", "createdAt"]); 
    return { filter, sort };
}