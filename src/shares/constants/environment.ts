import dotenv from "dotenv";
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 3000,
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
    CLIENT_URL: process.env.CLIENT_URL,
    CLIENT_URL_2: process.env.CLIENT_URL_2,


    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "default_secret_key",
    ACCESS_TOKEN_TTL: Number(process.env.ACCESS_TOKEN_TTL) || 30 * 60 * 1000,
    REFRESH_TOKEN_TTL: Number(process.env.REFRESH_TOKEN_TTL) || 7 * 24 * 60 * 60 * 1000, 

    EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
    EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
    EMAIL_USER: process.env.EMAIL_USER || "huysun2511@gmail.com",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,

    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,

    SEPAY_WEBHOOK_SECRET: process.env.SEPAY_WEBHOOK_SECRET as string,

    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

    NODE_ENV: process.env.NODE_ENV || "development",
}; 
