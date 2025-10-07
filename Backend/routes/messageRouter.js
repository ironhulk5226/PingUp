import express from "express";
import { sendMessage, sseController, getUserRecentMessages, getChatMessages } from "../controllers/messageController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";

const messageRouter = express.Router();

// @/api/message/send
messageRouter.post('/send', upload.single('image'), protect, sendMessage);

// // @/api/message/sse
// messageRouter.get('/sse', protect, sseController);

// @/api/message/chat-messages
messageRouter.get('/chat-messages', protect, getChatMessages);



// @/api/message/:userId - SSE endpoint with user ID (must be last)
// Note: No auth middleware here, handled internally in controller
messageRouter.get('/:userId', sseController);

export default messageRouter;