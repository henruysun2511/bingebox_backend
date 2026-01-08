import mongoose from "mongoose";
import { IUserBody } from "../../types/body.type";
import { AppError } from "../../utils/appError";
import { default as RoleModel } from "../Role/role.schema";
import UserModel from "./user.schema";


export class UserService {
    private userModel = UserModel;
    private roleModel = RoleModel;

    async getUserProfile(userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("User ID không hợp lệ", 400);
        }

        const user = await this.userModel.findOne({
            _id: userId,
            isDeleted: false,
        })
            .select("username email fullName avatar gender birth role membership currentPoints totalSpending createdAt")
            .populate({
                path: "role",
                select: "name",
                match: { isDeleted: false }
            })
            .populate({
                path: "membership",
                select: "name discountRate pointAccumulationRate",
                match: { isDeleted: false }
            })
            .lean();

        if (!user) {
            throw new AppError("Người dùng không tồn tại", 404);
        }

        return user;
    }

    async updateUserProfile(userId: string, data: IUserBody) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("User ID không hợp lệ", 400);
        }

        // Logic ngắn gọn hơn:
        const user = await this.userModel.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            { $set: data },
            {
                new: true,
                runValidators: true
            }
        )
            .select("username email fullName avatar gender birth role")
            .lean();

        if (!user) {
            throw new AppError("Người dùng không tồn tại", 404);
        }

        return user;
    }

    async assignUserRole(userId: string, roleId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roleId)) {
            throw new AppError("ID không hợp lệ", 400);
        }

        const roleExists = await this.roleModel.exists({ _id: roleId, isDeleted: false });
        if (!roleExists) {
            throw new AppError("Vai trò không tồn tại hoặc đã bị xóa", 404);
        }

        const updatedUser = await this.userModel.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            { role: roleId },
            { new: true, runValidators: true }
        ).select("username email role").populate("role", "name").lean();

        if (!updatedUser) throw new AppError("Người dùng không tồn tại", 404);

        return updatedUser;
    }
}