import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./permission.controller";
import * as v from "./permission.validation";

const router = Router();

router.use(authenticationMiddleware);
router.get("/", validationMiddleware(v.getPermissionListQuery, "query"), controller.getPermissions);
router.post("/", validationMiddleware(v.createPermission, "body"), controller.createPermission);
router.patch("/:id", validationMiddleware(v.getPermissionIdParam, "params"), validationMiddleware(v.updatePermission, "body"), controller.updatePermission);
router.delete("/:id", validationMiddleware(v.getPermissionIdParam, "params"), controller.deletePermission);

export default router;