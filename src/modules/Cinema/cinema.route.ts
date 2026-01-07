import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./cinema.controller";
import * as v from "./cinema.validation";

const router = Router();

router.get("/", validateMiddleware(v.getCinemaListQuery, "query"), controller.getCinemas);

router.get("/:id", validateMiddleware(v.getCinemaIdParam, "query"), controller.getCinemaDetail);

router.post("/", 
    authenticationMiddleware, 
    validateMiddleware(v.createCinema, "body"), 
    controller.createCinema
);

router.patch("/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.createCinema, "body"), // Dùng chung create cho update hoặc tạo mới v.updateCinema
    controller.updateCinema
);

router.delete("/:id", authenticationMiddleware, controller.deleteCinema);

export default router;