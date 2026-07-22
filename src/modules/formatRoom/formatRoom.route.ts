import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./formatRoom.controller";
import * as v from "./formatRoom.validation";

const router = Router();

router.get("/", controller.getFormatRooms);
router.post("/", authenticationMiddleware, validationMiddleware(v.createFormatRoom, "body"), controller.createFormatRoom);
router.patch("/:id", authenticationMiddleware, validationMiddleware(v.updateFormatRoom, "body"), controller.updateFormatRoom);
router.delete("/:id", authenticationMiddleware, controller.deleteFormatRoom);

export default router;