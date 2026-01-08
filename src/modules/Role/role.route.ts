import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./role.controller";
import * as v from "./role.validation";

const router = Router();

router.use(authenticationMiddleware); // Chỉ Admin mới truy cập các route này

router.get("/", validateMiddleware(v.getRoleListQuery, "query"), controller.getRoles);
router.post("/", validateMiddleware(v.createRole, "body"), controller.createRole);
router.patch("/:id", validateMiddleware(v.getRoleIdParam, "params"), validateMiddleware(v.updateRole, "body"), controller.updateRole);
router.delete("/:id", validateMiddleware(v.getRoleIdParam, "params"), controller.deleteRole);

export default router;