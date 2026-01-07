import { Router } from "express";
import actorRouter from "./Actor/actor.route";
import authRouter from "./Auth/auth.route";
import categoryRouter from "./Category/category.route";
import cinemaRouter from "./Cinema/cinema.route";
import movieRouter from "./Movie/movie.route";
import userRouter from "./User/user.route";
const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/actors", actorRouter);
router.use("/categories", categoryRouter);
router.use("/movies", movieRouter);
router.use("/cinemas", cinemaRouter);

export default router;