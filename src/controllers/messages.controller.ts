import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/messages.service';
import { CreateMessageDto, UpdateMessageDto } from '../common/dtos/messages.dto';
import { PaginationQueryDto } from '../common/dtos/pagination.dto';
import { plainToClass } from 'class-transformer';

export class MessageController {
    private service: MessageService;

    constructor() {
        this.service = new MessageService();
    }

    /**
     * @swagger
     * /api/v1/messages:
     *   post:
     *     tags: [Messages]
     *     summary: Create a new message
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateMessageDto'
     *     responses:
     *       201:
     *         description: Message created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MessageResponseDto'
     *       400:
     *         description: Bad request - Invalid input
     */
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToClass(CreateMessageDto, req.body);
            const result = await this.service.create(dto);
            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @swagger
     * /api/v1/messages:
     *   get:
     *     tags: [Messages]
     *     summary: Get all messages with optional filtering by conversationId
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *       - in: query
     *         name: conversationId
     *         schema:
     *           type: integer
     *           description: Filter by conversation ID
     *     responses:
     *       200:
     *         description: List of messages
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/MessageResponseDto'
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
     * /api/v1/messages/{id}:
     *   get:
     *     tags: [Messages]
     *     summary: Get a message by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Message found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MessageResponseDto'
     *       404:
     *         description: Message not found
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
     * /api/v1/messages/{id}:
     *   put:
     *     tags: [Messages]
     *     summary: Update a message
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateMessageDto'
     *     responses:
     *       200:
     *         description: Message updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MessageResponseDto'
     *       404:
     *         description: Message not found
     */
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const dto = plainToClass(UpdateMessageDto, req.body);
            const result = await this.service.update(id, dto);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @swagger
     * /api/v1/messages/{id}:
     *   delete:
     *     tags: [Messages]
     *     summary: Delete a message
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Message deleted successfully
     *       404:
     *         description: Message not found
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
