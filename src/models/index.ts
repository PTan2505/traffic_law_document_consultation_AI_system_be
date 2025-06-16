import { ConversationSchemas } from './schema/conversation.schema';
import { MessageSchemas } from './schema/messages.schema';

export const AllSchemas = {
  ...ConversationSchemas,
  ...MessageSchemas,
};
