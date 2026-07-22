import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import * as controller from "./movie.controller";
import * as v from "./movie.validation";

const router = Router();


// Public
router.get(
  "/", 
  validationMiddleware(v.getMovieListQuery, "query"), 
  controller.getMovies
);

// Admin & Auth
router.get(
  "/admin", 
  authenticationMiddleware, 
  validationMiddleware(v.getMovieListQuery, "query"), 
  controller.getMoviesForAdmin
);

// Favorite & Watched
router.get(
    "/favourite",
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
  validationMiddleware(v.getMovieIdParam, "params"), 
  controller.getActorsByMovie
);


router.get(
  "/:id", 
  validationMiddleware(v.getMovieIdParam, "params"), 
  controller.getMovieDetail
);

router.post(
  "/", 
  authenticationMiddleware, 
  validationMiddleware(v.createMovie, "body"), 
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
  validationMiddleware(v.getMovieIdParam, "params"), 
  validationMiddleware(v.updateMovie, "body"), 
  controller.updateMovie
);

router.delete(
  "/:id", 
  authenticationMiddleware, 
  validationMiddleware(v.getMovieIdParam, "params"), 
  controller.deleteMovie
);

export default router;