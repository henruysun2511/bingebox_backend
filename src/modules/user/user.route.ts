import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./user.controller";
import * as v from "./user.validation";

const router = Router();

router.get("/me", authenticationMiddleware, controller.getUserProfile);
router.patch("/me", authenticationMiddleware, validationMiddleware(v.updateUserProfileBody), controller.updateUserProfile);

router.patch(
    "/assign-role/:id",
    authenticationMiddleware,
    validationMiddleware(v.getUserIdParam, "params"),
    validationMiddleware(v.assignRole, "body"),
    controller.assignUserRole
);
export default router;

router.get(
    "/",
    authenticationMiddleware,
    validationMiddleware(v.getUserListQuery, "query"),
    controller.getUsers
);

router.patch(
    "/toggle-block/:id",
    authenticationMiddleware,
    validationMiddleware(v.getUserIdParam, "params"),
    validationMiddleware(v.blockUserBody, "body"),
    controller.toggleBlockUser
);

router.patch(
    "/redeem-points/:id",
    authenticationMiddleware,
    // restrictTo('ADMIN'), // Chặn nếu chỉ muốn Admin thực hiện
    validationMiddleware(v.getUserIdParam, "params"),
    validationMiddleware(v.redeemPoints, "body"),
    controller.redeemUserPoints
);