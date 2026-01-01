import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validate } from '../../middlewares/validation.middleware';
import * as controller from "./auth.controller";
import * as v from "./auth.validation";

const router = Router();

router.post("/register", validate(v.register, "body"), controller.register);
router.post("/login", validate(v.login, "body"), controller.login);
router.post("/logout", authenticationMiddleware, controller.logout);
router.post("/refresh-token", authenticationMiddleware, controller.refreshToken);
router.post("/forgot-password", validate(v.forgotPassword, "body"), controller.forgotPassword);
router.post("/reset-password", validate(v.resetPassword, "body"), controller.resetPassword);

export default router;
