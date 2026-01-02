import { AppError } from "../../utils/appError";
import CategoryModel from "./category.schema";

export class CategoryService {
    private categoryModel = CategoryModel;

    async getCategories() {
        // Lấy toàn bộ, sắp xếp theo name 
        return await this.categoryModel
            .find({ isDeleted: false })
            .sort({ name: 1 }) 
            .lean();
    }

    async createCategory(name: string, userId: string) {
        const existed = await this.categoryModel.findOne({ name, isDeleted: false });
        if (existed) throw new AppError("Danh mục đã tồn tại", 409);

        return await this.categoryModel.create({ name, createdBy: userId });
    }

    async updateCategory(id: string, name: string, userId: string) {
        const category = await this.categoryModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { name, updatedBy: userId },
            { new: true, runValidators: true }
        );
        if (!category) throw new AppError("Không tìm thấy danh mục", 404);
        return category;
    }

    async deleteCategory(id: string, userId: string) {
        const category = await this.categoryModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );
        if (!category) throw new AppError("Không tìm thấy danh mục", 404);
        return category;
    }
}