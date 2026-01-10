import { Router } from "express";
import * as controller from "./quickTicketBuying.controller";

const router = Router();

router.get("/cinemas/:movieId", controller.getCinemasByMovie);
router.get("/dates", controller.getDatesByMovieAndCinema);
router.get("/times", controller.getShowtimesFinal);

export default router;