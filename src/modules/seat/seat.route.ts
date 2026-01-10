import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./seat.controller";
import * as v from "./seat.validation";

const router = Router();

router.put(
  "/:roomId",
  authenticationMiddleware,
  validateMiddleware(v.updateSeatSchema.params, "params"),
  validateMiddleware(v.updateSeatSchema.body, "body"),
  controller.updateSeat
);

router.get(
    "/rooms/:roomId", 
    validateMiddleware(v.getSeatsByRoomParam, "params"), 
    controller.getSeatsByRoom
);

router.get("/showtimes/:showtimeId", validateMiddleware(v.getSeatsByShowtimeParam, "params"),  controller.getSeatsByShowtime);

export default router;