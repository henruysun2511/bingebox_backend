import mongoose from "mongoose";
import { AppError } from "../../utils/appError";
import { buildPagination } from "../../utils/buildPagination";
import { buildVoucherQuery } from "./voucher.query";
import VoucherModel from "./voucher.schema";

export class VoucherService {
    private voucherModel = VoucherModel;

    async getVouchers(query: any) {
        const { filter, sort } = buildVoucherQuery(query);
        const { page, limit, skip } = buildPagination(query);

        const [items, total] = await Promise.all([
            this.voucherModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            this.voucherModel.countDocuments(filter),
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

    async getVoucherDetail(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("ID không hợp lệ", 400);
        
        const voucher = await this.voucherModel.findOne({ _id: id, isDeleted: false });
        if (!voucher) throw new AppError("Không tìm thấy voucher", 404);
        
        return voucher;
    }

    async createVoucher(data: any, userId: string) {
        const duplicate = await this.voucherModel.findOne({ 
            code: data.code.toUpperCase(), 
            isDeleted: false 
        });
        if (duplicate) throw new AppError("Mã Voucher này đã tồn tại", 400);

        return this.voucherModel.create({
            ...data,
            usedCount: 0,
            createdBy: userId,
        });
    }

    async updateVoucher(id: string, data: any, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("ID không hợp lệ", 400);

        const updatedVoucher = await this.voucherModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: userId },
            { new: true, runValidators: true }
        );

        if (!updatedVoucher) throw new AppError("Không tìm thấy voucher", 404);
        return updatedVoucher;
    }

    async deleteVoucher(id: string, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("ID không hợp lệ", 400);

        const voucher = await this.voucherModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            },
            { new: true }
        );

        if (!voucher) throw new AppError("Không tìm thấy voucher", 404);
        return voucher;
    }
}