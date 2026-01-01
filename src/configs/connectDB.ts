import mongoose from "mongoose";
import { ENV } from "../shares/constants/enviroment";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_CONNECTION_STRING as string);
    console.log("Liên kết CSDL thành công!");
  } catch (error) {
    console.log("Lỗi khi kết nối CSDL:", error);
    process.exit(1);
  }
};