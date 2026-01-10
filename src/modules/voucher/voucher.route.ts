import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./voucher.controller";
import * as v from "./voucher.validation";

const router = Router();

router.get(
    "/", 
    validateMiddleware(v.getVoucherListQuery, "query"), 
    controller.getVouchers
);

router.get(
    "/:id", 
    validateMiddleware(v.getVoucherIdParam, "params"), 
    controller.getVoucherDetail
);

router.post(
    "/", 
    authenticationMiddleware, 
    validateMiddleware(v.createVoucher, "body"), 
    controller.createVoucher
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.getVoucherIdParam, "params"), 
    validateMiddleware(v.updateVoucher, "body"), 
    controller.updateVoucher
);

router.delete(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.getVoucherIdParam, "params"), 
    controller.deleteVoucher
);

export default router;