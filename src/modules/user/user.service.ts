import mongoose from "mongoose";
import { IUserBody } from "../../types/body.type";
import { AppError } from "../../utils/appError";
import UserModel from "./user.schema";

export class UserService {
    private userModel = UserModel;

    async getUserProfile(userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("User ID không hợp lệ", 400);
        }

        const user = await this.userModel.findOne({
            _id: userId,
            isDeleted: false,
        })
            .select("username email fullName avatar gender birth role createdAt")
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
}