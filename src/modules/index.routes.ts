import { Router } from "express";
import actorRouter from "./Actor/actor.route";
import authRouter from "./Auth/auth.route";
import categoryRouter from "./Category/category.route";
import cinemaRouter from "./Cinema/cinema.route";
import formatRoomRouter from "./FormatRoom/formatRoom.route";
import movieRouter from "./Movie/movie.route";
import showtimeRouter from "./Showtime/showtime.route";
import timeSlotRouter from "./TimeSlot/timeSlot.route";
import userRouter from "./User/user.route";
const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/actors", actorRouter);
router.use("/categories", categoryRouter);
router.use("/movies", movieRouter);
router.use("/cinemas", cinemaRouter);
router.use("/format-rooms", formatRoomRouter);
router.use("/showtimes", showtimeRouter);
router.use("/time-slots", timeSlotRouter);

export default router;