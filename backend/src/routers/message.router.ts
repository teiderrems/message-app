import MessageController from '@/controllers/message.controller';
import { Router } from 'express';
import multer from 'multer';


const messageRouter = Router();

messageRouter.get("/:id", MessageController.getMessage);
messageRouter.get("/chat/:chatId", MessageController.getMessagesByChatId);
messageRouter.post("/", MessageController.createMessage);
messageRouter.put("/:id", MessageController.updateMessage);
messageRouter.patch("/:id", multer().array("attachments"), MessageController.updateMessageAttachments);
messageRouter.patch("/:id/change-view-status", MessageController.updateMessageStatus);
messageRouter.delete("/:id", MessageController.deleteMessage);

export default messageRouter;