import { ConversationSchemas } from "./schema/conversation.schema";
import { MessageSchemas } from "./schema/messages.schema";
import { UserSchemas } from "./schema/user.schema";
import { AuthSchemas } from "./schema/auth.schema";

export const AllSchemas = {
  ...ConversationSchemas,
  ...MessageSchemas,
  ...UserSchemas,
  ...AuthSchemas,
};
