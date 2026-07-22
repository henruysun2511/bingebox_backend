import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./timeSlot.controller";
import * as v from "./timeSlot.validation";

const router = Router();


router.get("/", controller.getTimeSlots);


router.post(
    "/",
    authenticationMiddleware,
    validationMiddleware(v.createTimeSlot, "body"),
    controller.createTimeSlot
);

router.patch(
    "/:id",
    authenticationMiddleware,
    validationMiddleware(v.updateTimeSlot, "body"),
    controller.updateTimeSlot
);

router.delete("/:id", authenticationMiddleware, controller.deleteTimeSlot);

export default router;