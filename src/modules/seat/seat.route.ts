import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./seat.controller";
import * as v from "./seat.validation";

const router = Router();

router.put(
  "/:roomId",
  authenticationMiddleware,
  validationMiddleware(v.updateSeatSchema.params, "params"),
  validationMiddleware(v.updateSeatSchema.body, "body"),
  controller.updateSeat
);

router.get(
    "/rooms/:roomId", 
    validationMiddleware(v.getSeatsByRoomParam, "params"), 
    controller.getSeatsByRoom
);

router.get("/showtimes/:showtimeId", validationMiddleware(v.getSeatsByShowtimeParam, "params"),  controller.getSeatsByShowtime);

export default router;