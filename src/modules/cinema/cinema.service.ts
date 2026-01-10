import { ICinemaBody } from "../../types/body.type";
import { ICinemaQuery } from "../../types/param.type";
import { AppError } from "../../utils/appError";
import { buildPagination } from "../../utils/buildPagination";
import { buildCinemaQuery } from "./cinema.query";
import CinemaModel from "./cinema.schema";

export class CinemaService {
    private cinemaModel = CinemaModel;

    async getCinemas(query: ICinemaQuery) {
        const { filter, sort } = buildCinemaQuery(query);
        const { page, limit, skip } = buildPagination(query);

        const [items, total] = await Promise.all([
            this.cinemaModel.find(filter).sort(sort).skip(skip).limit(limit)
                .select("_id name image location").lean(),
            this.cinemaModel.countDocuments(filter),
        ]);

        return {
            items,
            pagination: { page, limit, totalItems: total, totalPages: Math.ceil(total / limit) },
        };
    }

    async getCinemaDetail(id: string) {
        const cinema = await this.cinemaModel.findOne({
            _id: id,
            isDeleted: false,
        });

        if (!cinema) {
            throw new AppError("Không tìm thấy rạp", 404);
        }

        return cinema;
    }

    async createCinema(data: ICinemaBody, userId: string) {
        const duplicate = await this.cinemaModel.findOne({ name: data.name, isDeleted: false });
        if (duplicate) throw new AppError("Tên rạp đã tồn tại", 400);

        return this.cinemaModel.create({ ...data, createdBy: userId });
    }

    async updateCinema(id: string, data: ICinemaBody, userId: string) {
        const cinema = await this.cinemaModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true }
        );
        if (!cinema) throw new AppError("Không tìm thấy rạp", 404);
        return cinema;
    }

    async deleteCinema(id: string, userId: string) {
        const cinema = await this.cinemaModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
            { new: true }
        );
        if (!cinema) throw new AppError("Không tìm thấy rạp", 404);
        return cinema;
    }

   
}