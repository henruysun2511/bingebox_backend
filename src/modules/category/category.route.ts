import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./category.controller";
import * as v from "./category.validation";

const router = Router();

router.get("/", controller.getCategories);

router.post(
    "/",
    authenticationMiddleware,
    validateMiddleware(v.createCategoryBody, "body"),
    controller.createCategory
);

router.patch("/:id",
    authenticationMiddleware,
    validateMiddleware(v.GetCategoryIdParam, "params"),
    validateMiddleware(v.updateCategoryBody, "body"),
    controller.updateCategory);

router.delete("/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.GetCategoryIdParam, "params"), 
    controller.deleteCategory);

export default router;