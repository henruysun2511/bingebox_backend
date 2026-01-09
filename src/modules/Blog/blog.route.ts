import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as c from "./blog.controller";
import * as v from "./blog.validation";

const router = Router();

router.get(
    "/", 
    validateMiddleware(v.blogListQuery, "query"), 
    c.getBlogs
);

router.get(
    "/:idOrSlug", 
    c.getBlogDetail
);

router.post(
    "/", 
    authenticationMiddleware, 
    validateMiddleware(v.createBlogBody, "body"), 
    c.createBlog
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validateMiddleware(v.blogIdParam, "params"), 
    validateMiddleware(v.updateBlogBody, "body"), 
    c.updateBlog
);

router.delete(
    "/:id",
    authenticationMiddleware,
    validateMiddleware(v.blogIdParam, "params"),
    c.deleteBlog
);

export default router;