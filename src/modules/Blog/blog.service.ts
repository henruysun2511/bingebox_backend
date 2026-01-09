import { IBlogBody } from "@/types/body.type";
import { IBlogQuery } from "@/types/param.type";
import { buildPagination } from "@/utils/buildPagination";
import slugify from "slugify";
import { AppError } from "../../utils/appError";
import { buildBlogQuery } from "./blog.query";
import BlogModel from "./blog.schema";

export class BlogService {
    private blogModel = BlogModel;

    async createBlog(data: IBlogBody, userId: string) {
        const slug = slugify(data.title, { lower: true, locale: 'vi', strict: true });

        const duplicate = await this.blogModel.findOne({ slug, isDeleted: false });
        const finalSlug = duplicate ? `${slug}-${Date.now()}` : slug;

        return await this.blogModel.create({
            ...data,
            slug: finalSlug,
            author: userId,
            createdBy: userId
        });
    }

    async getBlogs(query: IBlogQuery) {
        const { filter } = buildBlogQuery(query);
        const { page, limit, skip } = buildPagination(query);

        const [items, total] = await Promise.all([
            this.blogModel.find(filter)
                .populate('author', 'fullName avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.blogModel.countDocuments(filter)
        ]);

        return {
            items,
            pagination: {
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    }

    async getBlogDetail(idOrSlug: string) {
        const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: idOrSlug, isDeleted: false }
            : { slug: idOrSlug, isDeleted: false };

        const blog = await this.blogModel.findOneAndUpdate(
            query,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author', 'fullName avatar');

        if (!blog) throw new AppError("Không tìm thấy bài viết", 404);
        return blog;
    }

    async updateBlog(id: string, data: IBlogBody, userId: string) {
        if (data.title) {
            data.slug = slugify(data.title, { lower: true, locale: 'vi', strict: true });
        }

        const updated = await this.blogModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true }
        );
        if (!updated) throw new AppError("Không tìm thấy bài viết để cập nhật", 404);
        return updated;
    }

    async deleteBlog(id: string, userId: string) {
        const deleted = await this.blogModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );
        if (!deleted) throw new AppError("Không tìm thấy bài viết để xóa", 404);
        return deleted;
    }
}