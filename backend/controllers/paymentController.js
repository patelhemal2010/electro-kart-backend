import asyncHandler from "../middlewares/asyncHandler.js";
import Razorpay from "razorpay";

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    const err = new Error("Razorpay credentials not configured");
    err.statusCode = 400;
    throw err;
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// GET /api/payment/razorpay-key
export const getRazorpayKey = asyncHandler(async (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID || "" });
});

// POST /api/payment/create-razorpay-order
// { amountInPaise, currency, receipt }
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amountInPaise, currency = "INR", receipt } = req.body || {};
  if (!amountInPaise || amountInPaise <= 0) {
    res.status(400);
    throw new Error("Invalid amount");
  }
  try {
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });
    res.json(order);
  } catch (e) {
    const status = e?.statusCode || 500;
    res.status(status).json({
      message:
        e?.message ||
        "Unable to create Razorpay order. Check server credentials.",
    });
  }
});


