import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from '../../middlewares/validation.middleware';
import * as controller from "./actor.controller";
import * as v from "./actor.validation";

const router = Router();

router.get("/", authenticationMiddleware, validateMiddleware(v.GetActorListQuery, "query"), controller.getActors);
router.get("/:id", validateMiddleware(v.GetActorIdParam, "params"), controller.getActorDetail);
router.post("/", authenticationMiddleware, validateMiddleware(v.createActor, "body"), controller.createActor);
router.put("/:id", authenticationMiddleware, validateMiddleware(v.GetActorIdParam, "params"), validateMiddleware(v.updateActor, "body"), controller.updateActor);
router.delete("/:id", authenticationMiddleware, validateMiddleware(v.GetActorIdParam, "params"), controller.deleteActor);
export default router;