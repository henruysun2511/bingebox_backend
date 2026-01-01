import dotenv from "dotenv";
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 3000,
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
    CLIENT_URL: process.env.CLIENT_URL,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "default_secret_key",
    ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || "30m", 
    REFRESH_TOKEN_TTL: Number(process.env.REFRESH_TOKEN_TTL) || 7 * 24 * 60 * 60 * 1000, 

    EMAIL_USER: process.env.EMAIL_USER || "huysun2511@gmail.com",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
}; 
