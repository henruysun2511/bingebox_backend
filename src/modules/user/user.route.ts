import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware";
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

router.get(
    "/",
    authenticationMiddleware,
    authorizationMiddleware,
    validateMiddleware(v.getUserListQuery, "query"),
    controller.getUsers
);

router.patch(
    "/toggle-block/:id",
    authenticationMiddleware,
    validateMiddleware(v.getUserIdParam, "params"),
    validateMiddleware(v.blockUserBody, "body"),
    controller.toggleBlockUser
);

router.patch(
    "/redeem-points/:id",
    authenticationMiddleware,
    // restrictTo('ADMIN'), // Chặn nếu chỉ muốn Admin thực hiện
    validateMiddleware(v.getUserIdParam, "params"),
    validateMiddleware(v.redeemPoints, "body"),
    controller.redeemUserPoints
);