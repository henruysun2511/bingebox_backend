import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./setting.controller";
import * as v from "./setting.validation";

const router = Router();

// Public route cho khách xem logo, hotline, banner...
router.get("/", controller.getSetting);

// Admin route để cập nhật
router.patch(
    "/",
    authenticationMiddleware,
    // Ở đây bạn nên thêm middleware checkRole('ADMIN') nếu có
    validationMiddleware(v.updateSettingBody, "body"),
    controller.updateSetting
);

export default router;