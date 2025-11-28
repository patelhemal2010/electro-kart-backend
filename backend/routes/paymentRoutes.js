import express from "express";
import {
  createRazorpayOrder,
  getRazorpayKey,
} from "../controllers/paymentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/razorpay-key", authenticate, getRazorpayKey);
router.post("/create-razorpay-order", authenticate, createRazorpayOrder);

export default router;


