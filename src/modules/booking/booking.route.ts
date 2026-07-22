import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import * as controller from "./booking.controller";

const router = Router();

router.get("/my-booking",  controller.getUserBookingDetail);
router.get("/", authenticationMiddleware, controller.getBookings);
router.get("/:id", authenticationMiddleware, controller.getBookingDetail);

router.post("/", authenticationMiddleware,controller.createBooking);

router.delete("/cleanup", authenticationMiddleware,
controller.cleanupCancelledData
);
export default router;