import MessageService from "@/services/message.service";
import {
  convertFileToAttachment,
  convertMessageDetailToMessageDetailDto,
} from "@/util";
import { Request, Response } from "express";

export default class MessageController {
  static async createMessage(req: Request, res: Response) {
    try {
      const message = await MessageService.addMessage({
        message: req.body.message,
        attachments: convertFileToAttachment(req),
      });
      return res
        .status(201)
        .json(convertMessageDetailToMessageDetailDto(req.protocol, req.host, message));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getMessage(req: Request, res: Response) {
    try {
      const message = await MessageService.getMessageById(
        Number(req.params.id)
      );
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      return res
        .status(200)
        .json(convertMessageDetailToMessageDetailDto(req.protocol, req.host, message));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateMessage(req: Request, res: Response) {
    try {
      const updated = await MessageService.updateMessage({
        id: Number(req.params.id),
        ...req.body,
      });
      if (!updated) {
        return res.status(404).json({ error: "Message not found" });
      }
      return res.status(200).json({ message: "Message updated successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateMessageAttachments(req: Request, res: Response) {
    try {
      const updated = await MessageService.updateMessageAttachments({
        id: Number(req.params.id),
        attachments: convertFileToAttachment(req),
      });
      if (!updated) {
        return res.status(404).json({ error: "Message not found" });
      }
      return res
        .status(200)
        .json({ message: "Message attachments updated successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateMessageStatus(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Invalid message ID" });
    }

    try {
      const updated = await MessageService.updateMessageIsViewed({
        id: +id,
      });
      if (!updated) {
        return res.status(404).json({ error: "Message not found" });
      }
      return res.status(200).json({ message: "Message status updated successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getMessagesByChatId(req: Request, res: Response) {

    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({ error: "Invalid chat ID" });
    }
    try {
      const messages = await MessageService.getMessagesByChatId(
        +chatId
      );
      return res.status(200).json(messages);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    try {
      const deleted = await MessageService.deleteMessage({
        id: Number(req.params.id),
      });
      if (!deleted) {
        return res.status(404).json({ error: "Message not found" });
      }
      return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
