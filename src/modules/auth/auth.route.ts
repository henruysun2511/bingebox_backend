import { Router } from "express";
import passport from "passport";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from '../../middlewares/validation.middleware';
import * as controller from "./auth.controller";
import * as v from "./auth.validation";

const router = Router();

router.post("/register", validateMiddleware(v.register, "body"), controller.register);
router.post("/login", validateMiddleware(v.login, "body"), controller.login);
router.post("/logout", authenticationMiddleware, controller.logout);
router.post("/refresh-token", authenticationMiddleware, controller.refreshToken);
router.post("/forgot-password", validateMiddleware(v.forgotPassword, "body"), controller.forgotPassword);
router.post("/reset-password", validateMiddleware(v.resetPassword, "body"), controller.resetPassword);
router.post("/change-password", authenticationMiddleware, validateMiddleware(v.ChangePasswordBody), controller.changePassword);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login" }), controller.googleCallback);

export default router;
