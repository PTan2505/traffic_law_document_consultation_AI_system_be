import { Router } from 'express';
import { ConversationController } from '../controllers/conversation.controller';

const conversationRouter = Router();
const controller = new ConversationController();

conversationRouter.post('/', controller.create);
conversationRouter.get('/:id', controller.findById);
conversationRouter.get('/', controller.findAll);
conversationRouter.put('/:id', controller.update);
conversationRouter.delete('/:id', controller.delete);

export default conversationRouter;
