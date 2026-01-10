import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./food.controller";
import * as v from "./food.validation";

const router = Router();

// Public route: Lấy danh sách đồ ăn để hiển thị khi đặt vé
router.get(
    "/", 
    validateMiddleware(v.getFoodListQuery, "query"), 
    controller.getFoods
);

// Admin routes: Quản lý món ăn
router.post(
    "/", 
    authenticationMiddleware, 
    validateMiddleware(v.createFoodBody, "body"), 
    controller.createFood
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.getFoodIdParam, "params"), 
    validateMiddleware(v.updateFoodBody, "body"), 
    controller.updateFood
);

router.delete(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.getFoodIdParam, "params"), 
    controller.deleteFood
);

export default router;