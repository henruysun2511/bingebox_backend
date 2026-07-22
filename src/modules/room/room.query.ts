import { GetRoomListQuery } from "./room.validation";

export function buildRoomQuery(query: GetRoomListQuery) {
    const filter: Record<string, any> = {
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