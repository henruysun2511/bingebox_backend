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

    // Sửa 1: Cải tiến hàm validate để an toàn hơn
    private async validatePermissions(permissions?: string[]) {
        // Nếu không truyền hoặc mảng rỗng thì bỏ qua không check DB
        if (!permissions || permissions.length === 0) return;

        // Loại bỏ các ID trùng lặp trong mảng gửi lên (nếu có)
        const uniqueIds = [...new Set(permissions)];

        const validPermissions = await this.permissionModel.find({
            _id: { $in: uniqueIds },
            isDeleted: false
        });

        if (validPermissions.length !== uniqueIds.length) {
            throw new AppError("Một hoặc nhiều quyền gửi lên không tồn tại hoặc đã bị xóa", 400);
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
                .sort({ createdAt: -1 }) // Thêm sort để xem cái mới nhất trước
                .lean(),
            this.roleModel.countDocuments(filter),
        ]);

        return {
            items,
            pagination: { page, limit, totalItems: total, totalPages: Math.ceil(total / limit) },
        };
    }

    async createRole(data: IRoleBody, userId: string) {
        const roleName = data.name.trim();

        const duplicate = await this.roleModel.findOne({ 
            name: { $regex: new RegExp(`^${roleName}$`, 'i') }, 
            isDeleted: false 
        });
        if (duplicate) throw new AppError(`Vai trò "${roleName}" đã tồn tại`, 400);

        // Sửa 3: Permissions là optional nên check trước khi validate
        if (data.permissions) {
            await this.validatePermissions(data.permissions as unknown as string[]);
        }

        return await this.roleModel.create({
            ...data,
            name: roleName,
            createdBy: userId,
        });
    }

    async updateRole(id: string, data: Partial<IRoleBody>, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("ID không hợp lệ", 400);

        // Sửa 4: Nếu đổi tên, phải check tên mới có trùng với Role khác không
        if (data.name) {
            const roleName = data.name.trim();
            const duplicate = await this.roleModel.findOne({
                name: { $regex: new RegExp(`^${roleName}$`, 'i') },
                _id: { $ne: id }, // Không tính chính nó
                isDeleted: false
            });
            if (duplicate) throw new AppError(`Tên vai trò "${roleName}" đã bị trùng`, 400);
            data.name = roleName;
        }

        if (data.permissions) {
            await this.validatePermissions(data.permissions as unknown as string[]);
        }

        const updated = await this.roleModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );

        if (!updated) throw new AppError("Không tìm thấy vai trò để cập nhật", 404);
        return updated;
    }

    async deleteRole(id: string, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("ID không hợp lệ", 400);

        // Sửa 5: Không cho xóa các Role hệ thống quan trọng (Optional)
        const role = await this.roleModel.findById(id);
        if (role && (role.name === 'ADMIN' || role.name === 'CUSTOMER')) {
            throw new AppError("Không thể xóa các vai trò mặc định của hệ thống", 403);
        }

        const deleted = await this.roleModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );

        if (!deleted) throw new AppError("Không tìm thấy vai trò", 404);
        return deleted;
    }
}