import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./voucher.controller";
import * as v from "./voucher.validation";

const router = Router();

router.get(
    "/", 
    validationMiddleware(v.getVoucherListQuery, "query"), 
    controller.getVouchers
);

router.get(
    "/:id", 
    validationMiddleware(v.getVoucherIdParam, "params"), 
    controller.getVoucherDetail
);

router.post(
    "/", 
    authenticationMiddleware, 
    validationMiddleware(v.createVoucher, "body"), 
    controller.createVoucher
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.getVoucherIdParam, "params"), 
    validationMiddleware(v.updateVoucher, "body"), 
    controller.updateVoucher
);

router.delete(
    "/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.getVoucherIdParam, "params"), 
    controller.deleteVoucher
);

router.patch(
    "/change-status/:id",
    authenticationMiddleware,
    validationMiddleware(v.getVoucherIdParam, "params"),
    validationMiddleware(v.updateVoucherStatusBody, "body"),
    controller.updateVoucherStatus
);

export default router;