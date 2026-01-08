import { IRoleQuery } from "@/types/param.type";

export function buildRoleQuery(query: IRoleQuery) {
    const filter: any = {
        isDeleted: false,
    };

    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }
    
    return { filter };
}