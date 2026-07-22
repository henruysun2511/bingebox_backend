import { z } from "zod";
import { AgePermissionTypeEnum, MovieStatusEnum, SubtitleTypeEnum } from "../../shares/constants/enum";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const getMovieListQuery = z.object({
  name: z.string().trim().optional(),
  status: z.nativeEnum(MovieStatusEnum).optional(),
  categoryIds: z.string().optional(),
  releaseDate: z.string().optional(),
  agePermission: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.string().optional(),
});

export type GetMovieListQuery = z.infer<typeof getMovieListQuery>;

export const getMovieIdParam = z.object({
  id: objectIdSchema,
});

export const createMovie = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên phim không được để trống"),
  duration: z
    .number()
    .min(1, "Thời lượng phải lớn hơn 0"),
  releaseDate: z
    .string()
    .or(z.date())
    .transform(v => new Date(v)),
  director: z
    .string()
    .optional(),
  description: z
    .string()
    .min(1, "Mô tả phim không được để trống"),
  subtitle: z
    .array(z.nativeEnum(SubtitleTypeEnum))
    .min(1, "Phải có ít nhất một loại phụ đề"),
  poster: z
    .string()
    .url("Link poster không hợp lệ"),
  banner: z
    .string()
    .url("Link banner không hợp lệ"),
  trailer: z
    .string()
    .url("Link trailer không hợp lệ"),
  actors: z
    .array(z.string())
    .min(1, "Phải có ít nhất một diễn viên"),
  categories: z
    .array(z.string())
    .min(1, "Phải có ít nhất một thể loại"),
  nationality: z
    .string()
    .optional(),
  agePermission: z
    .nativeEnum(AgePermissionTypeEnum)
    .optional(),
  status: z
    .nativeEnum(MovieStatusEnum),
  format: z
    .array(z.string())
    .optional(),
});

export type CreateMovieBody = z.infer<typeof createMovie>;

export const updateMovie = createMovie.partial().refine(
  d => Object.keys(d).length > 0,
  "Phải có ít nhất một trường cần cập nhật"
);

export type UpdateMovieBody = z.infer<typeof updateMovie>;
