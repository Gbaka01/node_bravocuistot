import express from "express";
import auth from "../middlewares/auth.js";
import moderator from "../middlewares/moderator.js";
import { upload } from "../middlewares/multer.js";
import {
  getRecettesForModeration,
  updateRecetteByModerator,
  moderateRecette,
  deleteRecetteByModerator,
} from "../controllers/moderation.controller.js";

const router = express.Router();

router.get(
  "/recettes",
  auth,
  moderator,
  getRecettesForModeration
);

router.patch(
  "/recettes/:id/status",
  auth,
  moderator,
  moderateRecette
);

router.put(
  "/recettes/:id",
  auth,
  moderator,
  upload.single("image"),
  updateRecetteByModerator
);

router.delete(
  "/recettes/:id",
  auth,
  moderator,
  deleteRecetteByModerator
);

export default router;