import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./comment.controller";
import * as v from "./comment.validation";

const router = Router();

router.get("/movies/:movieId", validateMiddleware(v.getCommentParams, "params"), controller.getRootComments);
router.get("/replies/:parentId", controller.getReplies);
router.post("/", authenticationMiddleware, validateMiddleware(v.createComment, "body"), controller.createComment);
router.patch(
    "/:id",
    authenticationMiddleware,
    validateMiddleware(v.commentIdParam, "params"),
    validateMiddleware(v.updateComment, "body"),
    controller.updateComment
);

router.delete(
    "/:id",
    authenticationMiddleware,
    validateMiddleware(v.commentIdParam, "params"),
    controller.deleteComment
);

router.post(
    "/likes/:id",
    authenticationMiddleware,
    validateMiddleware(v.commentIdParam, "params"),
    controller.toggleLike
);
export default router;