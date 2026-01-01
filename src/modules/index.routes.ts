import { Router } from "express";
import actorRouter from "./actor/actor.route";
import authRouter from "./auth/auth.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/actors", actorRouter);

export default router;