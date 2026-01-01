import mongoose from "mongoose";
import { IActorBody } from "../../types/body.type";
import { IActorQuery } from "../../types/param.type";
import { AppError } from "../../utils/appError";
import { buildPagination } from "../../utils/buildPagination";
import { buildActorQuery } from "./actor.query";
import ActorModel from "./actor.schema";

export class ActorService {
    private actorModel = ActorModel;

    async getActors(query: IActorQuery) {
        const { filter, sort } = buildActorQuery(query);
        const { page, limit, skip } = buildPagination(query);

        const [items, total] = await Promise.all([
            this.actorModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit),
            this.actorModel.countDocuments(filter),
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

    async getActorDetail(id: string) {
        const actor = await this.actorModel.findOne({
            _id: id,
            isDeleted: false,
        });

        if (!actor) {
            throw new AppError("Không tìm thấy diễn viên", 404);
        }

        return actor;
    }

    async createActor(data: IActorBody, userId: string) {
        const existed = await this.actorModel.findOne({
            name: data.name,
            isDeleted: false,
        });

        if (existed) {
            throw new AppError("Tên diễn viên đã tồn tại", 409);
        }

        return this.actorModel.create({
            ...data,
            createdBy: userId,
        });
    }

    async updateActor(id: string, data: IActorBody, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("ID không hợp lệ", 400);
        }

        const updatedActor = await this.actorModel.findOneAndUpdate(
            { _id: id, deleted: false },
            {
                ...data,
                updatedBy: userId
            },
            { new: true, runValidators: true }
        );

        if (!updatedActor) {
            throw new AppError("Không tìm thấy diễn viên", 404);
        }

        return updatedActor;
    }

    async deleteActor(id: string, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("ID không hợp lệ", 400);
        }

        const actor = await this.actorModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            },
            { new: true }
        );

        if (!actor) {
            throw new AppError("Không tìm thấy diễn viên", 404);
        }

        return actor;
    }
}