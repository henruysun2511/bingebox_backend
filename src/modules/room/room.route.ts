import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./room.controller";
import * as v from "./room.validation";

const router = Router();

router.get(
    "/",
    validationMiddleware(v.getRoomListQuery, "query"),
    controller.getRooms
);

router.post(
    "/",
    authenticationMiddleware,
    validationMiddleware(v.createRoomBody, "body"),
    controller.createRoom
);

router.patch(
    "/change-status/:id",
    authenticationMiddleware,
    validationMiddleware(v.getRoomIdParam, "params"),
    validationMiddleware(v.updateRoomStatusBody, "body"),
    controller.updateRoomStatus
);

router.patch(
    "/:id",
    authenticationMiddleware,
    validationMiddleware(v.getRoomIdParam, "params"),
    validationMiddleware(v.updateRoomBody, "body"),
    controller.updateRoom
);

router.delete(
    "/:id",
    authenticationMiddleware,
    validationMiddleware(v.getRoomIdParam, "params"),
    controller.deleteRoom
);



export default router;