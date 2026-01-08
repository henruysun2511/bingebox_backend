import { IMembershipBody } from "@/types/body.type";
import { AppError } from "../../utils/appError";
import MembershipModel from "./membership.schema";

export class MembershipService {
    private membershipModel = MembershipModel;

    async getMemberships() {
        return await this.membershipModel.find({ isDeleted: false }).sort({ minSpending: 1 }).lean();
    }

    async createMembership(data: IMembershipBody, userId: string) {
        const duplicate = await this.membershipModel.findOne({ name: data.name, isDeleted: false });
        if (duplicate) throw new AppError("Tên hạng thành viên này đã tồn tại", 400);

        return await this.membershipModel.create({ ...data, createdBy: userId });
    }

    async updateMembership(id: string, data: IMembershipBody, userId: string) {
        const result = await this.membershipModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );
        if (!result) throw new AppError("Không tìm thấy hạng thành viên", 404);
        return result;
    }

    async deleteMembership(id: string, userId: string) {
        const result = await this.membershipModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );
        if (!result) throw new AppError("Không tìm thấy hạng thành viên", 404);
        return result;
    }
}