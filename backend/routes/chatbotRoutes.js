import express from "express";
import {
  chatWithBot,
  getChatHistory,
  clearChatHistory,
  getChatbotSuggestions
} from "../controllers/chatbotController.js";

const router = express.Router();

// Chat with AI bot
router.post("/chat", chatWithBot);

// Get conversation history
router.get("/history/:userId", getChatHistory);

// Clear conversation history
router.delete("/history/:userId", clearChatHistory);

// Get chatbot suggestions
router.get("/suggestions", getChatbotSuggestions);

export default router;
