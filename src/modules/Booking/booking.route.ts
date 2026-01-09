import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import * as controller from "./booking.controller";

const router = Router();

router.get("/my-booking", controller.getUserBookingDetail);
router.get("/", authenticationMiddleware, controller.getBookings);
router.get("/:id", authenticationMiddleware, controller.getBookingDetail);

router.post("/", controller.createBooking);
router.post("/fake-pay/:id", controller.fakePayBooking);
router.post("/fake-fail/:id", controller.fakeFailBooking);

router.delete("/cleanup", authenticationMiddleware,
controller.cleanupCancelledData
);
export default router;