import { IBlogQuery } from "@/types/param.type";

export function buildBlogQuery(query: IBlogQuery) {
    const filter: any = { isDeleted: false };

    if (query.title) {
        filter.title = { $regex: query.title, $options: "i" };
    }
    
    if (query.isPublished !== undefined) {
        filter.isPublished = query.isPublished === 'true';
    }

    return { filter };
}