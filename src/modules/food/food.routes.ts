import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./food.controller";
import * as v from "./food.validation";

const router = Router();

// Public route: Lấy danh sách đồ ăn để hiển thị khi đặt vé
router.get(
    "/", 
    validationMiddleware(v.getFoodListQuery, "query"), 
    controller.getFoods
);

// Admin routes: Quản lý món ăn
router.post(
    "/", 
    authenticationMiddleware, 
    validationMiddleware(v.createFoodBody, "body"), 
    controller.createFood
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.getFoodIdParam, "params"), 
    validationMiddleware(v.updateFoodBody, "body"), 
    controller.updateFood
);

router.delete(
    "/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.getFoodIdParam, "params"), 
    controller.deleteFood
);

export default router;