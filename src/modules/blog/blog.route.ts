import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as c from "./blog.controller";
import * as v from "./blog.validation";

const router = Router();

router.get(
    "/", 
    validationMiddleware(v.blogListQuery, "query"), 
    c.getBlogs
);

router.get(
    "/:idOrSlug", 
    c.getBlogDetail
);

router.post(
    "/", 
    authenticationMiddleware, 
    validationMiddleware(v.createBlogBody, "body"), 
    c.createBlog
);

router.patch(
    "/:id", 
    authenticationMiddleware, 
    validationMiddleware(v.blogIdParam, "params"), 
    validationMiddleware(v.updateBlogBody, "body"), 
    c.updateBlog
);

router.delete(
    "/:id",
    authenticationMiddleware,
    validationMiddleware(v.blogIdParam, "params"),
    c.deleteBlog
);

router.patch(
    "/publish/:id",
    authenticationMiddleware,
    validationMiddleware(v.getBlogIdParam, "params"),
    validationMiddleware(v.updateBlogPublishedBody, "body"),
    c.updateBlogPublished
);


export default router;