import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./showtime.controller";
import * as v from "./showtime.validation";

const router = Router();

router.get("/", validateMiddleware(v.getShowtimeQuery, "query"), controller.getShowtimes);

router.get(
  "/:id", 
  validateMiddleware(v.getShowtimeIdParam, "params"), 
  controller.getShowtimeDetail
);

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

//Lấy theo rạp
router.get(
  "/cinemas/:cinemaId",
  validateMiddleware(v.getShowtimeByCinemaParam, "params"),
  validateMiddleware(v.getScheduleQuery, "query"),
  controller.getShowtimeByCinema
);



//Lấy theo phim
router.get(
    "/movies/:movieId",
    validateMiddleware(v.getShowtimeByMovieParam, "params"), // Cần tạo validation param
    controller.getShowtimesByMovie
);

//Gom nhóm theo phòng
router.get(
  "/cinemas/:cinemaId/rooms",
  validateMiddleware(v.getShowtimeByCinemaParam, "params"),
  validateMiddleware(v.getScheduleQuery, "query"),
  controller.getShowtimesGroupByRoom
);

export default router;