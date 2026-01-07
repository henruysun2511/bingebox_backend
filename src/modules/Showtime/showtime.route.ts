import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./showtime.controller";
import * as v from "./showtime.validation";

const router = Router();

router.get("/", validateMiddleware(v.getShowtimeQuery, "query"), controller.getShowtimes);

router.post(
  "/",
  authenticationMiddleware,
  validateMiddleware(v.createShowtime, "body"),
  controller.createShowtime
);

router.patch(
  "/:id",
  authenticationMiddleware,
  validateMiddleware(v.updateShowtime, "body"),
  controller.updateShowtime
);

router.delete("/:id", authenticationMiddleware, controller.deleteShowtime);

export default router;