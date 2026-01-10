import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import * as controller from "./upload.controller";
const router = Router();

router.post(
  "/upload-image",
  uploadMiddleware.single("image"),
  controller.uploadImage
);

router.post(
  "/upload-images",
  uploadMiddleware.array("images", 5),
  controller.uploadImages
);

// Xóa 1 ảnh duy nhất
router.delete(
  "/delete-image",
  authenticationMiddleware,
  controller.deleteImage
);

// Xóa nhiều ảnh cùng lúc
router.delete(
  "/delete-images",
  authenticationMiddleware,
  controller.deleteImages
);

export default router;