import ChatController from "@/controllers/chat.controller";
import { Router } from "express";

const chatRouter: Router = Router();

chatRouter.post("/", ChatController.createChat);
chatRouter.get("/:id", ChatController.getChatById);
chatRouter.get("/:id/message-not-viewed/count", ChatController.getNumberOfMessageWhichIsNotViewed);
chatRouter.put("/:id", ChatController.updateChat);
chatRouter.delete("/:id", ChatController.deleteChat);

export default chatRouter;