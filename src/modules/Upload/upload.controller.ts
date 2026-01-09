import { AppError } from "@/utils/appError";
import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from "express";
import { success } from "../../utils/response";
import { UploadService } from "./upload.service";

const uploadService = new UploadService();

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("Không có file nào được tải lên", 400);

    const result = uploadService.formatUploadResult(req.file);
    return success(res, result, "Tải ảnh lên thành công", 201);
});

export const uploadImages = catchAsync(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) throw new AppError("Không có file", 400);

    const result = uploadService.formatUploadResult(files);
    return success(res, result, "Tải loạt ảnh lên thành công", 201);
});

export const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.body;

  if (!publicId) {
    throw new AppError("Vui lòng cung cấp publicId để xóa", 400);
  }

  await uploadService.deleteFromCloudinary(publicId);

  return success(res, null, "Xóa ảnh thành công");
});

export const deleteImages = catchAsync(async (req: Request, res: Response) => {
  const { publicIds } = req.body; 

  if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
    throw new AppError("Vui lòng cung cấp danh sách publicIds (mảng)", 400);
  }
  await uploadService.deleteFromCloudinary(publicIds);

  return success(res, null, `Đã xóa ${publicIds.length} ảnh thành công`);
});