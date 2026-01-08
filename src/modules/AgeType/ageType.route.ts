import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./ageType.controller";
import * as v from "./ageType.validation";

const router = Router();

router.get("/", controller.createAgeType);


router.post(
    "/", 
    authenticationMiddleware, 
    validateMiddleware(v.createAgeTypeBody, "body"), 
    controller.createAgeType
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.getAgeTypeIdParam, "params"), 
    validateMiddleware(v.updateAgeTypeBody, "body"), 
    controller.updateAgeType
);

router.delete(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.getAgeTypeIdParam, "params"), 
    controller.removeAgeType
);

export default router;