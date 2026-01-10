

import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./room.controller";
import * as v from "./room.validation";

const router = Router();

router.get(
    "/",
    validateMiddleware(v.getRoomListQuery, "query"),
    controller.getRooms
);

router.post(
    "/",
    authenticationMiddleware,
    validateMiddleware(v.createRoomBody, "body"),
    controller.createRoom
);

router.patch(
    "/:id",
    authenticationMiddleware,
    validateMiddleware(v.getRoomIdParam, "params"),
    validateMiddleware(v.updateRoomBody, "body"),
    controller.updateRoom
);

router.delete(
    "/:id",
    authenticationMiddleware,
    validateMiddleware(v.getRoomIdParam, "params"),
    controller.deleteRoom
);

export default router;