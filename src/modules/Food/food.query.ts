import { IFoodQuery } from "@/types/param.type";

export function buildFoodQuery(query: IFoodQuery) {
    const filter: any = {
        isDeleted: false,
    };

    // Tìm kiếm theo tên (không phân biệt hoa thường)
    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }

    // Lọc theo khoảng giá
    if (query.minPrice || query.maxPrice) {
        filter.price = {};
        if (query.minPrice) filter.price.$gte = Number(query.minPrice);
        if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    return { filter };
}