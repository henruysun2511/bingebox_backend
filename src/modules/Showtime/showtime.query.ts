
import { IShowtimeQuery } from "@/types/param.type";
import { buildSort } from "../../utils/buidSort";

export function buildShowtimeQuery(query: IShowtimeQuery) {
    const filter: any = {
        isDeleted: false,
    };

    if (query.movieId) {
        filter.movie = query.movieId;
    }

    if (query.roomId) {
        filter.room = query.roomId;
    }

    if (query.status) {
        filter.status = query.status;
    }

    if (query.date) {
        const start = new Date(query.date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(query.date);
        end.setHours(23, 59, 59, 999);

        filter.date = { $gte: start, $lte: end };
    }

    const sort = buildSort(query.sort, ["createdAt"]);
    return { filter, sort };
}