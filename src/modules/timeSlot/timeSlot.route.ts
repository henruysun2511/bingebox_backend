import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./timeSlot.controller";
import * as v from "./timeSlot.validation";

const router = Router();


router.get("/", controller.getTimeSlots);


router.post(
    "/",
    authenticationMiddleware,
    validateMiddleware(v.createTimeSlot, "body"),
    controller.createTimeSlot
);

router.patch(
    "/:id",
    authenticationMiddleware,
    validateMiddleware(v.updateTimeSlot, "body"),
    controller.updateTimeSlot
);

router.delete("/:id", authenticationMiddleware, controller.deleteTimeSlot);

export default router;