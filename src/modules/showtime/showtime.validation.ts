import { z } from "zod";
import { BaseStatusEnum, SubtitleTypeEnum } from "../../shares/constants/enum";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getShowtimeQuery = z.object({
  movieId: z.string().optional(),
  roomId: z.string().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).optional(),
  sort: z.string().optional(),
});

export type GetShowtimeQuery = z.infer<typeof getShowtimeQuery>;

export const getShowtimeIdParam = z.object({
  id: objectIdSchema,
});

export const createShowtime = z.object({
  movie: z
    .string()
    .min(1, "Phim là bắt buộc"),
  subtitle: z
    .nativeEnum(SubtitleTypeEnum),
  room: z
    .string()
    .min(1, "Phòng chiếu là bắt buộc"),
  startTime: z
    .string()
    .datetime({ message: "Thời gian phải đúng định dạng ISO" }),
});

export type CreateShowtimeBody = z.infer<typeof createShowtime>;

export const updateShowtime = createShowtime.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải có ít nhất một trường cần cập nhật"
);

export type UpdateShowtimeBody = z.infer<typeof updateShowtime>;

export const getShowtimeByCinemaParam = z.object({
  cinemaId: objectIdSchema,
});

export const getScheduleQuery = z.object({
  date: z.string().optional(),
});

export const getShowtimeByMovieParam = z.object({
  movieId: objectIdSchema,
});

export const updateShowtimeStatusBody = z.object({
  status: z.nativeEnum(BaseStatusEnum),
});
