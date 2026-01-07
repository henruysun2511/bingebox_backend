import { IRoomQuery } from "@/types/param.type";

export function buildRoomQuery(query: IRoomQuery) {
    const filter: any = {
        isDeleted: false,
    };

    if (query.cinemaId) {
        filter.cinema = query.cinemaId;
    }

    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }

    return { filter };
}