import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as c from "./ticketPrice.controller";
import * as v from "./ticketPrice.validation";

const router = Router();

router.get(
    "/", 
    validateMiddleware(v.ticketPriceListQuery, "query"), 
    c.getPrices
);

router.post(
    "/", 
    authenticationMiddleware, 
    validateMiddleware(v.createTicketPriceBody, "body"), 
    c.createPrice
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.ticketPriceIdParam, "params"), 
    validateMiddleware(v.updateTicketPriceBody, "body"), 
    c.updatePrice
);

export default router;