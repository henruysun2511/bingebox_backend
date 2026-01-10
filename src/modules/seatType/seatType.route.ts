import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./seatType.controller";
import * as v from "./seatType.validation";

const router = Router();

router.get("/", controller.getSeatTypes);

router.post(
    "/", 
    authenticationMiddleware, 
    validateMiddleware(v.createSeatType, "body"), 
    controller.createSeatType
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.getSeatTypeIdParam, "params"), 
    validateMiddleware(v.updateSeatType, "body"), 
    controller.updateSeatType
);

router.delete(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.getSeatTypeIdParam, "params"), 
    controller.deleteSeatType
);

export default router;