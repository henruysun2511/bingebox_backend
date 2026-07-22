import mongoose from "mongoose";
import { CreatePermissionBody, GetPermissionListQuery } from "./permission.validation";
import { AppError } from "../../utils/appError";
import { buildPagination } from "../../utils/buildPagination";
import { buildPermissionQuery } from "./permission.query";
import PermissionModel from "./permission.schema";

export class PermissionService {
    private permissionModel = PermissionModel;

    async getPermissions(query: GetPermissionListQuery) {
        const { filter, sort } = buildPermissionQuery(query);
        const { page, limit, skip } = buildPagination(query);

        const [items, total] = await Promise.all([
            this.permissionModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            this.permissionModel.countDocuments(filter),
        ]);

        return {
            items,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async createPermission(data: CreatePermissionBody, userId: string) {
        const duplicate = await this.permissionModel.findOne({ 
            path: data.path, 
            method: data.method,
            isDeleted: false 
        });
        
        if (duplicate) {
            throw new AppError("Quyền hạn với Path và Method này đã tồn tại", 400);
        }

        return this.permissionModel.create({
            ...data,
            createdBy: userId,
        });
    }

    async updatePermission(id: string, data: CreatePermissionBody, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("ID không hợp lệ", 400);

        const updated = await this.permissionModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );

        if (!updated) throw new AppError("Không tìm thấy quyền hạn", 404);
        return updated;
    }

    async deletePermission(id: string, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("ID không hợp lệ", 400);

        const deleted = await this.permissionModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            },
            { new: true }
        );

        if (!deleted) throw new AppError("Không tìm thấy quyền hạn", 404);
        return deleted;
    }
}