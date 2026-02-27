import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./movie.controller";
import * as v from "./movie.validation";

const router = Router();


// Public
router.get(
  "/", 
  validateMiddleware(v.getMovieListQuery, "query"), 
  controller.getMovies
);

// Admin & Auth
router.get(
  "/admin", 
  authenticationMiddleware, 
  validateMiddleware(v.getMovieListQuery, "query"), 
  controller.getMoviesForAdmin
);

// Favorite & Watched
router.get(
    "/favorite",
    authenticationMiddleware,
    controller.getMyFavoriteMovies
);

router.get(
    "/watched", 
    authenticationMiddleware, 
    controller.getWatchedMovies
);

// Actors
router.get(
  "/actors/:id", 
  validateMiddleware(v.getMovieIdParam, "params"), 
  controller.getActorsByMovie
);


router.get(
  "/:id", 
  validateMiddleware(v.getMovieIdParam, "params"), 
  controller.getMovieDetail
);

router.post(
  "/", 
  authenticationMiddleware, 
  validateMiddleware(v.createMovie, "body"), 
  controller.createMovie
);

router.post(
    "/likes/:id", 
    authenticationMiddleware, 
    controller.toggleLikeMovie
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

export default router;