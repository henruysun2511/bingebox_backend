import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import * as controller from "./ticket.controller";

const router = Router();

router.get("/my-tickets", authenticationMiddleware, controller.getUserTickets);
router.get("/:id", controller.getTicketDetail);

export default router;