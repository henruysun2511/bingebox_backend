import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import passport from "passport";
import { connectDB } from "./configs/connectDB";
import "./configs/passport.config";
import { connectRedis } from "./configs/redis.config";
import { initIo } from "./configs/socket.config";
import { startReleaseSeatCron } from "./crons/releaseSeat.cron";
import { errorMiddleware } from "./middlewares/error.middleware";
import { createRateLimiter } from "./middlewares/rateLimit.middleware";
import routes from "./modules/index.routes";
import { registerSeatSocket } from "./modules/seat/seat.gateway";
import { ENV } from "./shares/constants/environment";

const app = express();
const PORT = ENV.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", createRateLimiter(60000, 100, "Quá nhiều yêu cầu"));

app.use(passport.initialize());

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
  process.env.CLIENT_URL_3
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/v1", routes);
app.use(errorMiddleware);

const server = http.createServer(app);
const io = initIo(server);
registerSeatSocket(io);

Promise.all([connectDB(), connectRedis()]).then(() => {
  startReleaseSeatCron();

  server.listen(PORT, () => {  
    console.log(`server bắt đầu trên cổng ${PORT}`);
  });
});