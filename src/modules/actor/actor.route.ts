import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from '../../middlewares/validation.middleware';
import * as controller from "./actor.controller";
import * as v from "./actor.validation";

const router = Router();

router.get("/", validateMiddleware(v.GetActorListQuery, "query"), controller.getActors);
router.get("/:id", validateMiddleware(v.GetActorIdParam, "params"), controller.getActorDetail);
router.post("/", authenticationMiddleware, validateMiddleware(v.createActorBody, "body"), controller.createActor);
router.patch("/:id", authenticationMiddleware, validateMiddleware(v.GetActorIdParam, "params"), validateMiddleware(v.updateActorBody, "body"), controller.updateActor);
router.delete("/:id", authenticationMiddleware, validateMiddleware(v.GetActorIdParam, "params"), controller.deleteActor);
export default router;