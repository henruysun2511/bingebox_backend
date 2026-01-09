import { TicketStatusEnum } from "@/shares/constants/enum";
import mongoose from "mongoose";
import { IMovieBody } from "../../types/body.type";
import { IMovieQuery } from "../../types/param.type";
import { AppError } from "../../utils/appError";
import { buildPagination } from "../../utils/buildPagination";
import { default as ActorModel } from "../Actor/actor.schema";
import { default as CategoryModel } from "../Category/category.schema";
import { default as TicketModel } from "../Ticket/ticket.schema";
import { buildMovieQuery } from "./movie.query";
import { default as MovieModel } from "./movie.schema";

export class MovieService {
    private movieModel = MovieModel;
    private ticketModel = TicketModel;
    private actorModel = ActorModel;
    private categoryModel = CategoryModel;

    async getMovies(query: IMovieQuery) {
        const { filter, sort } = buildMovieQuery(query);
        const { page, limit, skip } = buildPagination(query);

        const [items, total] = await Promise.all([
            this.movieModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select("name poster releaseDate agePermission subtitle categories format")
                .populate({
                    path: "categories",
                    select: "name", // Chỉ lấy trường name của Category
                    match: { isDeleted: false } // Chỉ lấy các thể loại chưa bị xóa
                })
                .lean(),
            this.movieModel.countDocuments(filter),
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

    async getMoviesForAdmin(query: IMovieQuery) {
        const { filter, sort } = buildMovieQuery(query);
        const { page, limit, skip } = buildPagination(query);
        const [items, total] = await Promise.all([
            this.movieModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit),
            this.movieModel.countDocuments(filter),
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

    async getMovieDetail(id: string) {
        const movie = await this.movieModel.findOne({
            _id: id,
            isDeleted: false,
        });

        if (!movie) {
            throw new AppError("Không tìm thấy phim", 404);
        }

        return movie;
    }

    async getActorsByMovie(movieId: string) {
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            throw new AppError("Movie ID không hợp lệ", 400);
        }

        const movie = await this.movieModel
            .findOne({ _id: movieId, isDeleted: false })
            .populate({
                path: "actors",
                match: { isDeleted: false },
                select: "name avatar",
            });

        if (!movie) {
            throw new AppError("Không tìm thấy phim", 404);
        }

        return movie.actors;
    }

    async validateActors(actorIds?: mongoose.Types.ObjectId[]) {
        if (!actorIds || actorIds.length === 0) return;

        const uniqueIds = [...new Set(actorIds)];

        const actors = await this.actorModel.find({
            _id: { $in: uniqueIds },
            isDeleted: false,
        });

        if (actors.length !== uniqueIds.length) {
            throw new AppError("Có diễn viên không tồn tại hoặc đã bị xóa", 400);
        }
    }

    async validateCategories(categoryIds?: mongoose.Types.ObjectId[]) {
        if (!categoryIds || categoryIds.length === 0) return;

        const uniqueIds = [...new Set(categoryIds)];

        const categories = await this.categoryModel.find({
            _id: { $in: uniqueIds },
            isDeleted: false,
        });

        if (categories.length !== uniqueIds.length) {
            throw new AppError("Có thể loại không tồn tại hoặc đã bị xóa", 400);
        }
    }

    async createMovie(data: IMovieBody, userId: string) {
        await this.validateActors(data.actors);
        await this.validateCategories(data.categories);

        return this.movieModel.create({
            ...data,
            createdBy: userId,
        });
    }

    async updateMovie(id: string, data: IMovieBody, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("ID không hợp lệ", 400);
        }

        await this.validateActors(data.actors);
        await this.validateCategories(data.categories);

        const updatedMovie = await this.movieModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                ...data,
                updatedBy: userId
            },
            { new: true, runValidators: true }
        );

        if (!updatedMovie) {
            throw new AppError("Không tìm thấy phim", 404);
        }

        return updatedMovie;
    }

    async deleteMovie(id: string, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("ID không hợp lệ", 400);
        }

        const movie = await this.movieModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            },
            { new: true }
        );

        if (!movie) {
            throw new AppError("Không tìm thấy phim", 404);
        }

        return movie;
    }

    async getWatchedMovies(userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("User ID không hợp lệ", 400);
        }

        const tickets = await this.ticketModel.find({ 
            user: userId, 
            isDeleted: false,
            status: TicketStatusEnum.UNUSED || TicketStatusEnum.USED
        })
        .populate({
            path: "showtime",
            populate: {
                path: "movie",
                select: "name poster categories", 
                populate: { path: "categories", select: "name" } 
            }
        })
        .lean();

        //Loại bỏ các phim trùng lặp
        const moviesMap = new Map();
        
        tickets.forEach(ticket => {
            const movie = (ticket.showtime as any)?.movie;
            if (movie && !moviesMap.has(movie._id.toString())) {
                moviesMap.set(movie._id.toString(), movie);
            }
        });

        return Array.from(moviesMap.values());
    }

    async toggleLikeMovie(movieId: string, userId: string) {
        const movie = await MovieModel.findById(movieId);
        if (!movie) throw new AppError("Không tìm thấy phim", 404);

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const isLiked = movie.likes.includes(userObjectId);

        if (isLiked) {
            // Unlike: Xóa user khỏi mảng và giảm count
            movie.likes = movie.likes.filter(id => id.toString() !== userId);
            movie.likeCount = Math.max(0, movie.likeCount - 1);
        } else {
            // Like: Thêm user vào mảng và tăng count
            movie.likes.push(userObjectId);
            movie.likeCount += 1;
        }

        await movie.save();

        return {
            isLiked: !isLiked,
            likeCount: movie.likeCount
        };
    }

    async getMyFavoriteMovies(userId: string) {
        return await MovieModel.find({
            likes: new mongoose.Types.ObjectId(userId),
            isDeleted: false
        }).select("name poster categories likeCount");
    }
}