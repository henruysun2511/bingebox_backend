import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./configs/connectDB";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./modules/index.routes";
import { ENV } from "./shares/constants/enviroment";

dotenv.config();

const app = express();
const PORT = ENV.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));



app.use("/api/v1", routes);


app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
  });
});