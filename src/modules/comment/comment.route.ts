import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./comment.controller";
import * as v from "./comment.validation";

const router = Router();

router.get("/movies/:movieId", validationMiddleware(v.getCommentParams, "params"), controller.getRootComments);
router.get("/replies/:parentId", controller.getReplies);
router.post("/", authenticationMiddleware, validationMiddleware(v.createComment, "body"), controller.createComment);
router.patch(
    "/:id",
    authenticationMiddleware,
    validationMiddleware(v.commentIdParam, "params"),
    validationMiddleware(v.updateComment, "body"),
    controller.updateComment
);

router.delete(
    "/:id",
    authenticationMiddleware,
    validationMiddleware(v.commentIdParam, "params"),
    controller.deleteComment
);

router.post(
    "/likes/:id",
    authenticationMiddleware,
    validationMiddleware(v.commentIdParam, "params"),
    controller.toggleLike
);
export default router;