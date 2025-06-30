import { Router } from "express";
import testRouter from "./test.route"; // Import the test router
import conversationRouter from "./conversation";
import messagesRouter from "./messages";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";
import chatbotRouter from "./chatbot.routes";

const apiRouter = Router();
const API_PREFIX = ""; // Root path - no prefix needed

// Mount the routers under specific paths
apiRouter.use(`/test`, testRouter);
apiRouter.use(`/auth`, authRouter);
apiRouter.use(`/chatbot`, chatbotRouter);
apiRouter.use(`/conversations`, conversationRouter);
apiRouter.use(`/messages`, messagesRouter);
apiRouter.use(`/users`, userRouter);

// Add other feature routes here as your application grows
// apiRouter.use(`${API_PREFIX}/products`, productRoutes);
// apiRouter.use(`${API_PREFIX}/orders`, orderRoutes);

export default apiRouter; // Export the aggregated API router
