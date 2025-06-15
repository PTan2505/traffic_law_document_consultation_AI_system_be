import { Request, Response, NextFunction } from 'express';
import { ConversationService } from '../services/conversation.service';
import { CreateConversationDto, UpdateConversationDto } from '../common/dtos/conversation.dto';
import { PaginationQueryDto } from '../common/dtos/pagination.dto';
import { plainToClass } from 'class-transformer';

export class ConversationController {
    private service: ConversationService;

    constructor() {
        this.service = new ConversationService();
    }

    /**
     * @swagger
     * /api/v1/conversations:
     *   post:
     *     tags: [Conversations]
     *     summary: Create a new conversation
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateConversationDto'
     *     responses:
     *       201:
     *         description: Conversation created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ConversationResponseDto'
     *       400:
     *         description: Bad request - Invalid input
     */
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToClass(CreateConversationDto, req.body);
            const result = await this.service.create(dto);
            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @swagger
     * /api/v1/conversations:
     *   get:
     *     tags: [Conversations]
     *     summary: Get all conversations with pagination, sorting, and filtering
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: The page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 10
     *         description: The number of items per page
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search term to filter conversations by title or content
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           enum: [createdAt, title, updatedAt]
     *         description: Field to sort by
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *           default: desc
     *         description: Sort order (ascending or descending)
     *       - in: query
     *         name: filters
     *         schema:
     *           type: string
     *         description: "JSON string of filters (e.g. {\"userId\": 1})"
     *     responses:
     *       200:
     *         description: List of conversations
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/ConversationResponseDto'
     *                 meta:
     *                   type: object
     *                   properties:
     *                     total:
     *                       type: integer
     *                       description: Total number of conversations
     *                     page:
     *                       type: integer
     *                       description: Current page number
     *                     lastPage:
     *                       type: integer
     *                       description: Total number of pages
     *                     hasNextPage:
     *                       type: boolean
     *                       description: Whether there is a next page
     *                     hasPreviousPage:
     *                       type: boolean
     *                       description: Whether there is a previous page
     *       400:
     *         description: Bad request - Invalid query parameters
     */
    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = plainToClass(PaginationQueryDto, req.query);
            const result = await this.service.findAll(query);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @swagger
     * /api/v1/conversations/{id}:
     *   get:
     *     tags: [Conversations]
     *     summary: Get a conversation by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Conversation ID
     *     responses:
     *       200:
     *         description: Conversation found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ConversationResponseDto'
     *       404:
     *         description: Conversation not found
     */
    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.findById(id);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @swagger
     * /api/v1/conversations/{id}:
     *   put:
     *     tags: [Conversations]
     *     summary: Update a conversation
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Conversation ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateConversationDto'
     *     responses:
     *       200:
     *         description: Conversation updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ConversationResponseDto'
     *       400:
     *         description: Bad request - Invalid input
     *       404:
     *         description: Conversation not found
     */
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.update(id, plainToClass(UpdateConversationDto, req.body));
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @swagger
     * /api/v1/conversations/{id}:
     *   delete:
     *     tags: [Conversations]
     *     summary: Delete a conversation
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Conversation ID
     *     responses:
     *       204:
     *         description: Conversation deleted successfully
     *       404:
     *         description: Conversation not found
     */
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            await this.service.delete(id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
