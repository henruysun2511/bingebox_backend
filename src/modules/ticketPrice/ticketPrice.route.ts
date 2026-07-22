import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as c from "./ticketPrice.controller";
import * as v from "./ticketPrice.validation";

const router = Router();

router.get(
    "/", 
    validationMiddleware(v.ticketPriceListQuery, "query"), 
    c.getPrices
);

router.post(
    "/", 
    authenticationMiddleware, 
    validationMiddleware(v.createTicketPriceBody, "body"), 
    c.createPrice
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.ticketPriceIdParam, "params"), 
    validationMiddleware(v.updateTicketPriceBody, "body"), 
    c.updatePrice
);

router.post(
    "/preview",
    authenticationMiddleware,
    c.previewSeatPrice
);

export default router;