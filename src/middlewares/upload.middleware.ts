import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "binge-box-cinema", 
    resource_type: "image",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Chỉ được upload ảnh"));
      return;
    }
    cb(null, true);
  },
});