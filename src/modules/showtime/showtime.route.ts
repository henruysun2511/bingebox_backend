import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./showtime.controller";
import * as v from "./showtime.validation";

const router = Router();

router.get("/", validationMiddleware(v.getShowtimeQuery, "query"), controller.getShowtimes);

router.get(
  "/:id", 
  validationMiddleware(v.getShowtimeIdParam, "params"), 
  controller.getShowtimeDetail
);

router.post(
  "/",
  authenticationMiddleware,
  validationMiddleware(v.createShowtime, "body"),
  controller.createShowtime
);

router.patch(
  "/:id",
  authenticationMiddleware,
  validationMiddleware(v.updateShowtime, "body"),
  controller.updateShowtime
);

router.delete("/:id", authenticationMiddleware, controller.deleteShowtime);

//Lấy theo rạp
router.get(
  "/cinemas/:cinemaId",
  validationMiddleware(v.getShowtimeByCinemaParam, "params"),
  validationMiddleware(v.getScheduleQuery, "query"),
  controller.getShowtimeByCinema
);



//Lấy theo phim
router.get(
    "/movies/:movieId",
    validationMiddleware(v.getShowtimeByMovieParam, "params"), 
    controller.getShowtimesByMovie
);

//Gom nhóm theo phòng
router.get(
  "/cinemas/:cinemaId/rooms",
  validationMiddleware(v.getShowtimeByCinemaParam, "params"),
  validationMiddleware(v.getScheduleQuery, "query"),
  controller.getShowtimesGroupByRoom
);

router.patch(
    "/change-status/:id",
    authenticationMiddleware,
    validationMiddleware(v.getShowtimeIdParam, "params"),
    validationMiddleware(v.updateShowtimeStatusBody, "body"),
    controller.updateShowtimeStatus
);

export default router;