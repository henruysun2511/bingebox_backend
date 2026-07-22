import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./role.controller";
import * as v from "./role.validation";

const router = Router();

router.use(authenticationMiddleware); // Chỉ Admin mới truy cập các route này

router.get("/", validationMiddleware(v.getRoleListQuery, "query"), controller.getRoles);
router.post("/", validationMiddleware(v.createRole, "body"), controller.createRole);
router.patch("/:id", validationMiddleware(v.getRoleIdParam, "params"), validationMiddleware(v.updateRole, "body"), controller.updateRole);
router.delete("/:id", validationMiddleware(v.getRoleIdParam, "params"), controller.deleteRole);

export default router;