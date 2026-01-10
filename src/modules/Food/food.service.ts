import { ClientSession } from "mongoose";
import { IFoodBody } from "../../types/body.type";
import { IFoodQuery } from "../../types/param.type";
import { AppError } from "../../utils/appError";
import { buildFoodQuery } from "./food.query";
import FoodModel from "./food.schema";

export class FoodService {
    private foodModel = FoodModel;

    async getAllFoods(query: IFoodQuery) {
        const { filter } = buildFoodQuery(query);
        return await this.foodModel
            .find(filter)
            .sort({ createdAt: -1 }) 
            .lean();
    }

    async createFood(data: IFoodBody, userId: string) {
        const duplicate = await this.foodModel.findOne({ name: data.name, isDeleted: false });
        if (duplicate) throw new AppError("Tên món ăn này đã tồn tại", 400);

        return await this.foodModel.create({ ...data, createdBy: userId });
    }

    async updateFood(id: string, data: IFoodBody, userId: string) {
        const food = await this.foodModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );

        if (!food) throw new AppError("Không tìm thấy món ăn", 404);
        return food;
    }

    async deleteFood(id: string, userId: string) {
        const food = await this.foodModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            },
            { new: true }
        );

        if (!food) throw new AppError("Món ăn không tồn tại hoặc đã bị xóa trước đó", 404);
        return food;
    }

    async calculateFoods(foods: any[], session: ClientSession) {
        let total = 0;
        const payload = [];

        for (const item of foods ?? []) {
            const food = await FoodModel.findById(item.foodId).session(session);
            if (!food) throw new AppError("Món ăn không tồn tại", 404);

            total += Number(food.price) * item.quantity;
            payload.push({
                foodId: food._id,
                quantity: item.quantity,
                priceAtBooking: food.price
            });
        }

        return { foodTotal: total, foodsPayload: payload };
    }
}