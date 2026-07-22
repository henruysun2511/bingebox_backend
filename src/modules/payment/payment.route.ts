import express, { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import * as controller from "./payment.controller";

const router = Router();

router.post("/", authenticationMiddleware, controller.createPayment);
router.get("/:bookingId/status", authenticationMiddleware, controller.getPaymentStatus);
router.post("/sepay-webhook", express.text({ type: "*/*" }), controller.sepayWebhook);
router.post("/fail", authenticationMiddleware, controller.failPayment);

export default router;
