import mongoose from "mongoose";
import { baseFields } from "../../shares/bases/baseField";
import { AgePermissionTypeEnum, MovieStatusEnum, SubtitleTypeEnum } from "../../shares/constants/enum";
import { IMovie } from "../../types/object.type";

const movieSchema = new mongoose.Schema<IMovie>({
    ...baseFields,
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    releaseDate: {
        type: Date, 
        required: true
    },
    director: String,
    description: {
        type: String,   
        required: true
    },
    subtitle: {
        type: String,
        enum: Object.values(SubtitleTypeEnum),
    },
    poster: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        required: true
    },
    trailer: {
        type: String,
        required: true
    },
    actors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    nationality: String,
    agePermission: {
        type: String,
        required: true,
        enum: Object.values(AgePermissionTypeEnum)
    },
    status: {
        type: String,
        enum: Object.values(MovieStatusEnum),
        required: true
    },
    format: [String],
}, {
    timestamps: true
})

export default mongoose.model<IMovie>('Movie', movieSchema);