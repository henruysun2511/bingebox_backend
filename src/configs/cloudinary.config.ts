import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../shares/constants/environment";

if (!ENV.CLOUDINARY_NAME || !ENV.CLOUDINARY_API_KEY || !ENV.CLOUDINARY_API_SECRET) {
  console.error("Thiếu cấu hình Cloudinary trong .env");
  process.exit(1);
}

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default cloudinary;