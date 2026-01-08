import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./user.controller";
import * as v from "./user.validation";

const router = Router();

router.get("/me", authenticationMiddleware, controller.getUserProfile);
router.patch("/me", authenticationMiddleware, validateMiddleware(v.updateUserProfileBody), controller.updateUserProfile);

router.patch(
    "/assign-role/:id",
    authenticationMiddleware,
    // Nên có thêm middleware checkAdminRole ở đây
    validateMiddleware(v.getUserIdParam, "params"),
    validateMiddleware(v.assignRole, "body"),
    controller.assignUserRole
);
export default router;