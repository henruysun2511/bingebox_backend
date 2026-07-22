import mongoose from "mongoose";
import { ENV } from "../shares/constants/environment";

export const connectDB = async () => {
  const uri = ENV.MONGODB_CONNECTION_STRING;
  if (!uri) {
    console.error("MONGODB_CONNECTION_STRING chưa được cấu hình trong .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("Liên kết CSDL thành công!");
  } catch (error) {
    console.log("Lỗi khi kết nối CSDL:", error);
    process.exit(1);
  }
};