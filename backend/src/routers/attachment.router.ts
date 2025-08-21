import AttachmentController from "@/controllers/attachment.controller";
import { Router } from "express";
import multer from "multer";


const attachmentRouter = Router();

attachmentRouter.post("/", multer().array("attachments"), AttachmentController.createAttachment);
attachmentRouter.delete("/:id", AttachmentController.deleteAttachment);
attachmentRouter.put("/:id", multer().array("attachments"), AttachmentController.updateAttachment);
attachmentRouter.get("/:id", AttachmentController.getAttachmentById);

export default attachmentRouter;