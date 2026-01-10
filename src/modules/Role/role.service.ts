import mongoose from "mongoose";
import { IRoleBody } from "../../types/body.type";
import { AppError } from "../../utils/appError";
import { buildPagination } from "../../utils/buildPagination";
import PermissionModel from "../permission/permission.schema";
import { buildRoleQuery } from "./role.query";
import RoleModel from "./role.schema";

export class RoleService {
    private roleModel = RoleModel;
    private permissionModel = PermissionModel;

    private async validatePermissions(permissionIds: (string | mongoose.Types.ObjectId)[]) {
        const count = await this.permissionModel.countDocuments({
            _id: { $in: permissionIds },
            isDeleted: false,
        });

        if (count !== permissionIds.length) {
            throw new AppError("Một hoặc nhiều quyền không tồn tại hoặc đã bị xóa", 400);
        }
    }

    async getRoles(query: any) {
        const { filter } = buildRoleQuery(query);
        const { page, limit, skip } = buildPagination(query);

        const [items, total] = await Promise.all([
            this.roleModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate({
                    path: "permissions",
                    select: "name path method",
                    match: { isDeleted: false }
                })
                .lean(),
            this.roleModel.countDocuments(filter),
        ]);

        return {
            items,
            pagination: { page, limit, totalItems: total, totalPages: Math.ceil(total / limit) },
        };
    }

    async createRole(data: IRoleBody, userId: string) {
        const duplicate = await this.roleModel.findOne({ name: data.name, isDeleted: false });
        if (duplicate) throw new AppError("Tên vai trò này đã tồn tại", 400);

        await this.validatePermissions(data.permissions);

        return this.roleModel.create({
            ...data,
            createdBy: userId,
        });
    }

    async updateRole(id: string, data: IRoleBody, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("ID không hợp lệ", 400);

        if (data.permissions) {
            await this.validatePermissions(data.permissions);
        }

        const updated = await this.roleModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );

        if (!updated) throw new AppError("Không tìm thấy vai trò", 404);
        return updated;
    }

    async deleteRole(id: string, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("ID không hợp lệ", 400);

        const deleted = await this.roleModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );

        if (!deleted) throw new AppError("Không tìm thấy vai trò", 404);
        return deleted;
    }
}