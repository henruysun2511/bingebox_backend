import { GetRoleListQuery } from "./role.validation";

export function buildRoleQuery(query: GetRoleListQuery) {
    const filter: Record<string, any> = {
        isDeleted: false,
    };

    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }
    
    return { filter };
}