import { BlogListQuery } from "./blog.validation";

export function buildBlogQuery(query: BlogListQuery) {
    const filter: Record<string, any> = { isDeleted: false };

    if (query.title) {
        filter.title = { $regex: query.title, $options: "i" };
    }
    
    if (query.isPublished !== undefined) {
        filter.isPublished = query.isPublished;
    }

    return { filter };
}