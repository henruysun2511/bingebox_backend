import { IAgeTypebody } from "../../types/body.type";
import { IAgeTypeQuery } from "../../types/param.type";
import { AppError } from "../../utils/appError";
import { buildAgeTypeQuery } from "./ageType.query";
import AgeTypeModel from "./ageType.schema";

export class AgeTypeService {
    private ageTypeModel = AgeTypeModel;

    async getAgeTypes(query: IAgeTypeQuery) {
        const { filter } = buildAgeTypeQuery(query);
        return await this.ageTypeModel.find(filter).sort({ minAge: 1 }).lean();
    }

    async createAgeType(data: IAgeTypebody, userId: string) {
        const duplicate = await this.ageTypeModel.findOne({ name: data.name, isDeleted: false });
        if (duplicate) throw new AppError("Tên đối tượng này đã tồn tại", 400);

        return await this.ageTypeModel.create({ ...data, createdBy: userId });
    }

    async updateAgeType(id: string, data: any, userId: string) {
        const result = await this.ageTypeModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );
        if (!result) throw new AppError("Không tìm thấy để cập nhật", 404);
        return result;
    }

    async deleteAgeType(id: string, userId: string) {
        const result = await this.ageTypeModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );
        if (!result) throw new AppError("Không tìm thấy để xóa", 404);
        return result;
    }
}