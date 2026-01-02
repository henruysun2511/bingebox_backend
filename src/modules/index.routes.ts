import { Router } from "express";
import actorRouter from "./actor/actor.route";
import authRouter from "./auth/auth.route";
import categoryRouter from "./category/category.route";
import userRouter from "./user/user.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/actors", actorRouter);
router.use("/categories", categoryRouter);

export default router;