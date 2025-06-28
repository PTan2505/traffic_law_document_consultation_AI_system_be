import { Router } from "express";
import testRouter from "./test.route"; // Import the test router
import conversationRouter from "./conversation";
import messagesRouter from "./messages";
import userRouter from "./user.routes";

const apiRouter = Router();
const API_V1_PREFIX = "/api/v1";

// Mount the user router under a specific path, e.g., /api/v1/user
apiRouter.use(`${API_V1_PREFIX}/test`, testRouter);
apiRouter.use(`${API_V1_PREFIX}/conversations`, conversationRouter);
apiRouter.use(`${API_V1_PREFIX}/messages`, messagesRouter);
apiRouter.use(`${API_V1_PREFIX}/users`, userRouter);

// Add other feature routes here as your application grows
// apiRouter.use(`${API_V1_PREFIX}/products`, productRoutes);
// apiRouter.use(`${API_V1_PREFIX}/orders`, orderRoutes);

export default apiRouter; // Export the aggregated API router
