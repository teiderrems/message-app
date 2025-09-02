import prisma from "@/db/client";
import { Prisma, Attachment } from "@/generated/prisma";

export default class AttachmentService {

    static async createAttachment(messageId:number, data: Omit<Attachment, "id" | "createdAt" | "updatedAt"| "messageId" | "isVoice"| "duration"| "size">[]) {
        try {
            return await prisma.attachment.createMany({
                data: data.map(item => ({
                    ...item,
                    messageId
                }))
            });
        } catch (error) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    static async updateAttachment(id: number, data: Partial<Omit<Attachment, "id" | "createdAt" | "updatedAt"| "messageId">>) {
        try {
            return await prisma.attachment.update({
                where: { id },
                data,
            });
        } catch (error) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    static async getAttachmentById(id: number) {
        try {
            return await prisma.attachment.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    static async deleteAttachment(id: number) {
        try {
            return await prisma.attachment.delete({
                where: { id },
            });
        } catch (error) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error(error.message);
            }
            throw error;
        }
    }
}
