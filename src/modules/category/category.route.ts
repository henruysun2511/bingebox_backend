import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./category.controller";
import * as v from "./category.validation";

const router = Router();

router.get("/", controller.getCategories);

router.post(
    "/",
    authenticationMiddleware,
    validationMiddleware(v.createCategoryBody, "body"),
    controller.createCategory
);

router.patch("/:id",
    authenticationMiddleware,
    validationMiddleware(v.GetCategoryIdParam, "params"),
    validationMiddleware(v.updateCategoryBody, "body"),
    controller.updateCategory);

router.delete("/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.GetCategoryIdParam, "params"), 
    controller.deleteCategory);

export default router;