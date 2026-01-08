import { IUserQuery } from "@/types/param.type";
import { buildSort } from "../../utils/buidSort";

export function buildUserQuery(query: IUserQuery) {
    const filter: any = { isDeleted: false };

    if (query.username) {
        filter.username = { $regex: query.username, $options: "i" };
    }
    if (query.role) {
        filter.role = query.role;
    }
    if (query.isBlocked !== undefined) {
        filter.isBlocked = query.isBlocked === 'true';
    }

    const sort = buildSort(query.sort, ["username", "totalSpending", "createdAt"]);
    
    return { filter, sort };
}