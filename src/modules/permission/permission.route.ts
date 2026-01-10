import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./permission.controller";
import * as v from "./permission.validation";

const router = Router();

router.use(authenticationMiddleware);
router.get("/", validateMiddleware(v.getPermissionListQuery, "query"), controller.getPermissions);
router.post("/", validateMiddleware(v.createPermission, "body"), controller.createPermission);
router.patch("/:id", validateMiddleware(v.getPermissionIdParam, "params"), validateMiddleware(v.updatePermission, "body"), controller.updatePermission);
router.delete("/:id", validateMiddleware(v.getPermissionIdParam, "params"), controller.deletePermission);

export default router;