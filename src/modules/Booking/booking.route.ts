import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import * as controller from "./booking.controller";

const router = Router();

router.post("/", controller.createBooking);
router.get("/my-booking", controller.getUserBookingDetail);
router.get("/", authenticationMiddleware, controller.getBookings);
router.get("/admin/:id", authenticationMiddleware, controller.getBookingDetail);

export default router;