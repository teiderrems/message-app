import ChatService from "@/services/chat.service";
import { convertChatDetailToChatDetailDto } from "@/util";
import { Request, Response } from "express";

export default class ChatController {

    static async getChatById(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Invalid chat ID" });
        }

        try {
            const chat = await ChatService.getChatById(+id);
            if (chat) {
                return res.status(200).json(convertChatDetailToChatDetailDto(req.protocol, req.host, chat));
            }
            return res.status(404).json({ error: "Chat not found" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to retrieve chat" });
        }
    }

    static async createChat(req: Request, res: Response) {
        const { description, authorId } = req.body;

        if (!authorId) {
            return res.status(400).json({ error: "Invalid chat data" });
        }

        try {
            const chat = await ChatService.addchat({ chat: { description, authorId } });
            return res.status(201).json(chat);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to create chat" });
        }
    }

    static async updateChat(req: Request, res: Response) {
        const { id } = req.params;
        const { description, authorId } = req.body;

        if (!id || !description || !authorId) {
            return res.status(400).json({ error: "Invalid chat data" });
        }

        try {
            const chat = await ChatService.updateChat({ id: +id, chat: { description, authorId } });
            return res.status(200).json(chat);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to update chat" });
        }
    }

    static async getNumberOfMessageWhichIsNotViewed(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Invalid chat ID" });
        }

        try {
            const messages = await ChatService.getNumberOfMessageWhichIsNotViewed(+id);
            return res.status(200).json(messages);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to retrieve messages" });
        }
    }

    static async deleteChat(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Invalid chat ID" });
        }

        try {
            const deleted = await ChatService.deletechat({ id: +id });
            if (deleted) {
                return res.status(204).send();
            }
            return res.status(404).json({ error: "Chat not found" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to delete chat" });
        }
    }
}