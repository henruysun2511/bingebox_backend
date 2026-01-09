import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./movie.controller";
import * as v from "./movie.validation";

const router = Router();

// Public routes
router.get(
  "/", 
  validateMiddleware(v.getMovieListQuery, "query"), 
  controller.getMovies
);

router.get(
  "/:id", 
  validateMiddleware(v.getMovieIdParam, "params"), 
  controller.getMovieDetail
);

router.get(
  "/actors/:id", 
  validateMiddleware(v.getMovieIdParam, "params"), 
  controller.getActorsByMovie
);

router.get(
  "/admin", 
  authenticationMiddleware, 
  validateMiddleware(v.getMovieListQuery, "query"), 
  controller.getMoviesForAdmin
);

router.post(
  "/", 
  authenticationMiddleware, 
  validateMiddleware(v.createMovie, "body"), 
  controller.createMovie
);

router.patch(
  "/:id", 
  authenticationMiddleware, 
  validateMiddleware(v.getMovieIdParam, "params"), 
  validateMiddleware(v.updateMovie, "body"), 
  controller.updateMovie
);

router.delete(
  "/:id", 
  authenticationMiddleware, 
  validateMiddleware(v.getMovieIdParam, "params"), 
  controller.deleteMovie
);

router.get(
    "/watched", 
    authenticationMiddleware, 
    controller.getWatchedMovies
);

router.post(
    "/likes/:id", 
    authenticationMiddleware, 
    controller.toggleLikeMovie
);

router.get(
    "/favorite",
    authenticationMiddleware,
    controller.getMyFavoriteMovies
);

export default router;