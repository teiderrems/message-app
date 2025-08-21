import AttachmentService from "@/services/attachment.service";
import { convertFileToAttachment } from "@/util";
import { Request, Response } from "express";

export default class AttachmentController {
  

  static async createAttachment(req: Request, res: Response) {
    const { messageId } = req.body;
    if (!req.files || !messageId) {
        return res.status(400).json({ error: "Invalid file format" });
    }
    const attachments = convertFileToAttachment(req);
    try {
      const createdAttachments = await AttachmentService.createAttachment(messageId, attachments);
      return res.status(201).json(createdAttachments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create attachments" });
    }
  }

  static async deleteAttachment(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Invalid attachment ID" });
    }

    try {
      const deleted = await AttachmentService.deleteAttachment(+id);
      if (deleted) {
        return res.status(204).send();
      }
      return res.status(404).json({ error: "Attachment not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete attachment" });
    }
  }

  static async updateAttachment(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;

    if (!id || !data) {
      return res.status(400).json({ error: "Invalid attachment ID or data" });
    }
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Invalid file format or no files uploaded" });
    }
    const attachments = convertFileToAttachment(req);

    try {
      const updatedAttachment = await AttachmentService.updateAttachment(+id, attachments.at(0)!);
      if (updatedAttachment) {
        return res.status(200).json(updatedAttachment);
      }
      return res.status(404).json({ error: "Attachment not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update attachment" });
    }
  }

  static async getAttachmentById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Invalid attachment ID" });
    }

    try {
      const attachment = await AttachmentService.getAttachmentById(+id);
      if (attachment) {
        res.set({
            'Content-Type': attachment.mimetype,
            'Content-Disposition': `inline; filename="${attachment.filename}"`,
            'Content-Length': attachment.data.length,
        });
        return res.status(200).send(attachment.data);
      }
      return res.status(404).json({ error: "Attachment not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve attachment" });
    }
  }
}
