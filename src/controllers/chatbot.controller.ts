import { Request, Response, NextFunction } from "express";
import { ChatbotService } from "../services/chatbot.service";
import { ChatRequestDto } from "../common/dtos/chatbot.dto";
import { PaginationQueryDto } from "../common/dtos/pagination.dto";
import { plainToClass } from "class-transformer";

export class ChatbotController {
  private chatbotService: ChatbotService;

  constructor() {
    this.chatbotService = new ChatbotService();
  }

  /**
   * @swagger
   * /api/v1/chatbot/chat:
   *   post:
   *     tags: [Chatbot]
   *     summary: Send a message to the Vietnamese Traffic Law AI Assistant
   *     description: |
   *       Send a message to the AI assistant. Works for both guest and authenticated users.
   *       - **Guest users**: Temporary conversation (new chat replaces old one)
   *       - **Authenticated users**: Persistent conversations stored in database
   *     parameters:
   *       - in: header
   *         name: X-Guest-ID
   *         schema:
   *           type: string
   *         description: Guest identifier for temporary conversations (optional)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChatRequestDto'
   *     responses:
   *       200:
   *         description: AI response generated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ChatResponseDto'
   *       400:
   *         description: Bad request - Invalid input
   *       500:
   *         description: AI service error
   */
  chat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId || null;
      let guestId =
        (req.headers["x-guest-id"] as string) || req.body.guestSessionId;

      // If this is a guest request and no guest ID was provided, generate one
      if (!userId && !guestId) {
        guestId = this.generateGuestId();
      }

      const dto = plainToClass(ChatRequestDto, req.body);
      const result = await this.chatbotService.chat(userId, dto, guestId);

      // Return guest ID in response for client to store
      if (result.isGuest && guestId) {
        res.setHeader("X-Guest-ID", guestId);
        // Also include in response body for easier client handling
        (result as any).guestSessionId = guestId;
      }

      return res.json(result);
    } catch (error) {
      next(error);
    }
  };

  private generateGuestId(): string {
    return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * @swagger
   * /api/v1/chatbot/conversations:
   *   get:
   *     tags: [Chatbot]
   *     summary: Get user's chat conversations
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 10
   *         description: Number of conversations per page
   *     responses:
   *       200:
   *         description: List of user conversations
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         example: 1
   *                       title:
   *                         type: string
   *                         example: "Speed limit on highways"
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                       updatedAt:
   *                         type: string
   *                         format: date-time
   *                 meta:
   *                   $ref: '#/components/schemas/PaginationMeta'
   *       401:
   *         description: Unauthorized - Login required
   */
  getConversations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.chatbotService.getUserConversations(
        userId,
        page,
        limit
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/chatbot/conversations/{conversationId}/history:
   *   get:
   *     tags: [Chatbot]
   *     summary: Get chat history for a specific conversation
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conversationId
   *         required: true
   *         schema:
   *           type: integer
   *         description: Conversation ID
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 20
   *         description: Number of messages per page
   *     responses:
   *       200:
   *         description: Chat history retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         example: 1
   *                       question:
   *                         type: string
   *                         example: "What is the speed limit?"
   *                       answer:
   *                         type: string
   *                         example: "The speed limit varies by road type..."
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                 conversation:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     title:
   *                       type: string
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                 meta:
   *                   $ref: '#/components/schemas/PaginationMeta'
   *       401:
   *         description: Unauthorized - Login required
   *       403:
   *         description: Forbidden - Access denied to this conversation
   *       404:
   *         description: Conversation not found
   */
  getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const conversationId = parseInt(req.params.conversationId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.chatbotService.getChatHistory(
        userId,
        conversationId,
        page,
        limit
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/chatbot/guest/history:
   *   get:
   *     tags: [Chatbot]
   *     summary: Get guest chat history
   *     description: Get the current chat history for a guest user (temporary, not persisted)
   *     parameters:
   *       - in: header
   *         name: X-Guest-ID
   *         required: true
   *         schema:
   *           type: string
   *         description: Guest identifier
   *     responses:
   *       200:
   *         description: Guest chat history retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "guest_0"
   *                       question:
   *                         type: string
   *                         example: "What is the speed limit?"
   *                       answer:
   *                         type: string
   *                         example: "The speed limit varies by road type..."
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                 meta:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                       example: 1
   *                     isGuest:
   *                       type: boolean
   *                       example: true
   *                     conversationId:
   *                       type: string
   *                       example: "guest_123456"
   *       400:
   *         description: Bad request - Guest ID required
   */
  getGuestHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Accept guest ID from both header and query parameter
      const guestId =
        (req.headers["x-guest-id"] as string) ||
        (req.query.guestSessionId as string);

      if (!guestId) {
        return res.status(400).json({
          message:
            "Guest ID is required. Provide it via X-Guest-ID header or guestSessionId query parameter.",
        });
      }

      const result = await this.chatbotService.getGuestChatHistory(guestId);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
