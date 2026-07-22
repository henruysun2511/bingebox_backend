import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from '../../middlewares/validation.middleware';
import * as controller from "./actor.controller";
import * as v from "./actor.validation";

const router = Router();

router.get("/", validationMiddleware(v.GetActorListQuery, "query"), controller.getActors);
router.get("/:id", validationMiddleware(v.GetActorIdParam, "params"), controller.getActorDetail);
router.get("/movies/:id", validationMiddleware(v.GetActorIdParam, "params"), controller.getMoviesByActor);
router.post("/", authenticationMiddleware, validationMiddleware(v.createActorBody, "body"), controller.createActor);
router.patch("/:id", authenticationMiddleware, validationMiddleware(v.GetActorIdParam, "params"), validationMiddleware(v.updateActorBody, "body"), controller.updateActor);
router.delete("/:id", authenticationMiddleware, validationMiddleware(v.GetActorIdParam, "params"), controller.deleteActor);
export default router;