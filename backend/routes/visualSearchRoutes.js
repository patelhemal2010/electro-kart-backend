import express from "express";
import { visualSearch, getVisualSearchSuggestions, updateProductFeatures, uploadImage } from "../controllers/visualSearchController.js";

const router = express.Router();

// Visual search routes
router.route("/search").post(uploadImage, visualSearch);
router.route("/suggestions").get(getVisualSearchSuggestions);
router.route("/update-features/:productId").post(updateProductFeatures);

export default router;
