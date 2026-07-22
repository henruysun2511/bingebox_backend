import { Router } from "express";
import passport from "passport";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from '../../middlewares/validation.middleware';
import { createRateLimiter } from "../../middlewares/rateLimit.middleware";
import * as controller from "./auth.controller";
import * as v from "./auth.validation";

const loginLimiter = createRateLimiter(60000, 5, "Sai mật khẩu quá nhiều lần, vui lòng thử lại sau 1 phút");
const forgotPasswordLimiter = createRateLimiter(3600000, 3, "Quá nhiều yêu cầu đặt lại mật khẩu, vui lòng thử lại sau 1 giờ");

const router = Router();

router.post("/register", validationMiddleware(v.registerBody, "body"), controller.register);
router.post("/login", loginLimiter, validationMiddleware(v.loginBody, "body"), controller.login);
router.post("/logout", authenticationMiddleware, controller.logout);
router.post("/refresh-token", controller.refreshToken);
router.post("/forgot-password", forgotPasswordLimiter, validationMiddleware(v.forgotPasswordBody, "body"), controller.forgotPassword);
router.post("/reset-password", validationMiddleware(v.resetPasswordBody, "body"), controller.resetPassword);
router.post("/change-password", authenticationMiddleware, validationMiddleware(v.ChangePasswordBody), controller.changePassword);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/login",
  }),
  controller.googleCallback
);
export default router;
