import { GetVoucherListQuery } from "./voucher.validation";
import { buildSort } from "../../utils/buidSort";

export function buildVoucherQuery(query: GetVoucherListQuery) {
    const filter: Record<string, any> = {
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