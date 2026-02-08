import { IShowtimeQuery } from "../../types/param.type";
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
        const start = new Date(`${query.date}T00:00:00+07:00`);
        const end = new Date(`${query.date}T23:59:59+07:00`);

        filter.startTime = { $gte: start, $lte: end };
    }

    const sort = buildSort(query.sort, ["createdAt"]);
    return { filter, sort };
}