import cloudinary from "@/configs/cloudinary.config";
import { AppError } from "@/utils/appError";

export class UploadService {
  async deleteFromCloudinary(publicIds: string | string[]) {
    try {
      const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
      
      const results = await Promise.all(
        ids.map((id) => cloudinary.uploader.destroy(id))
      );

      // Kiểm tra xem có ảnh nào xóa thất bại không 
      const failed = results.filter((res) => res.result !== "ok");
      if (failed.length > 0) {
        console.warn("Một số PublicId không tồn tại hoặc không xóa được:", failed);
      }

      return results;
    } catch (error) {
      throw new AppError("Lỗi khi kết nối với Cloudinary", 500);
    }
  }

  formatUploadResult(files: Express.Multer.File | Express.Multer.File[]) {
    if (Array.isArray(files)) {
      return files.map((file) => ({
        url: (file as any).path,
        publicId: (file as any).filename,
      }));
    }
    return {
      url: (files as any).path,
      publicId: (files as any).filename,
    };
  }
}