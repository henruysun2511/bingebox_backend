import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./seatType.controller";
import * as v from "./seatType.validation";

const router = Router();

router.get("/", controller.getSeatTypes);

router.post(
    "/", 
    authenticationMiddleware, 
    validationMiddleware(v.createSeatType, "body"), 
    controller.createSeatType
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.getSeatTypeIdParam, "params"), 
    validationMiddleware(v.updateSeatType, "body"), 
    controller.updateSeatType
);

router.delete(
    "/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.getSeatTypeIdParam, "params"), 
    controller.deleteSeatType
);

export default router;