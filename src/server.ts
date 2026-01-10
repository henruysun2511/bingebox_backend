import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { connectDB } from "./configs/connectDB";
import { initIo } from "./configs/socket.config";
import { startReleaseSeatCron } from "./crons/releaseSeat.cron";
import { errorHandlerMiddleware } from "./middlewares/error.middleware";
import routes from "./modules/index.routes";
import { registerSeatSocket } from "./modules/seat/seat.gateway";
import { ENV } from "./shares/constants/enviroment";

dotenv.config();

const app = express();
const PORT = ENV.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/v1", routes);

app.use(errorHandlerMiddleware);

const server = http.createServer(app);
const io = initIo(server);
registerSeatSocket(io);


connectDB().then(() => {
  startReleaseSeatCron();

  app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
  });
});

