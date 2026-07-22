import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./ageType.controller";
import * as v from "./ageType.validation";

const router = Router();

router.get(
    "/", 
    validationMiddleware(v.getAgeTypeQuery, "query"), 
    controller.getAgeTypes
);


router.post(
    "/", 
    authenticationMiddleware, 
    validationMiddleware(v.createAgeTypeBody, "body"), 
    controller.createAgeType
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.getAgeTypeIdParam, "params"), 
    validationMiddleware(v.updateAgeTypeBody, "body"), 
    controller.updateAgeType
);

router.delete(
    "/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.getAgeTypeIdParam, "params"), 
    controller.removeAgeType
);

export default router;