import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./membership.controller"; // Bạn tự tạo controller tương tự các file trước nhé
import * as v from "./membership.validation";

const router = Router();

router.get("/", controller.getMemberships);

router.post(
    "/", 
    authenticationMiddleware, 
    validateMiddleware(v.createMembershipBody, "body"), 
    controller.createMembership
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.getMembershipIdParam, "params"), 
    validateMiddleware(v.updateMembershipBody, "body"), 
    controller.updateMembership
);

router.delete(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.getMembershipIdParam, "params"), 
    controller.removeMembership
);

export default router;