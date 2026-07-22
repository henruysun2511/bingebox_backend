import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./cinema.controller";
import * as v from "./cinema.validation";

const router = Router();

router.get("/", validationMiddleware(v.getCinemaListQuery, "query"), controller.getCinemas);

router.get("/:id", validationMiddleware(v.getCinemaIdParam, "params"), controller.getCinemaDetail);

router.post("/", 
    authenticationMiddleware, 
    validationMiddleware(v.createCinema, "body"), 
    controller.createCinema
);

router.patch("/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.createCinema, "body"), // Dùng chung create cho update hoặc tạo mới v.updateCinema
    controller.updateCinema
);

router.delete("/:id", authenticationMiddleware, controller.deleteCinema);

export default router;