import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validate } from '../../middlewares/validation.middleware';
import * as controller from "./actor.controller";
import * as v from "./actor.validation";

const router = Router();

router.get("/", authenticationMiddleware, validate(v.GetActorListQuery, "query"), controller.getActors);
router.get("/:id", validate(v.GetActorIdParam, "params"), controller.getActorDetail);
router.post("/", authenticationMiddleware, validate(v.createActor, "body"), controller.createActor);
router.put("/:id", authenticationMiddleware, validate(v.GetActorIdParam, "params"), validate(v.updateActor, "body"), controller.updateActor);
router.delete("/:id", authenticationMiddleware, validate(v.GetActorIdParam, "params"), controller.deleteActor);
export default router;