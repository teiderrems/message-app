import prisma from "@/db/client";
import { Attachment, Message, Prisma } from "@/generated/prisma";

export default class MessageService {
  static async addMessage({
    message,
    attachments,
  }: {
    message: Partial<Message>;
    attachments?: Omit<
      Attachment,
      "id" | "createdAt" | "updatedAt" | "messageId"
    >[];
  }) {
    try {
      if (attachments) {
        return await prisma.message.create({
          data: {
            content: message.content,
            author: {
              connect: {
                id: message.authorId,
              },
            },
            chat: {
              connect: {
                id: message.chatId,
              },
            },
            attachments: {
              createMany: {
                data: attachments,
              },
            },
          },
          select: {
            id: true,
            content: true,
            attachments: {
              select: {
                id: true,
              },
            },
            author: {
              select: {
                id: true,
                username: true,
                email: true,
                Profil: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            createdAt: true,
          },
        });
      }

      return await prisma.message.create({
        data: {
          content: message.content,
          author: {
            connect: {
              id: message.authorId,
            },
          },
          chat: {
            connect: {
              id: message.chatId,
            },
          },
        },
        select: {
          id: true,
          content: true,
          attachments: {
            select: {
              id: true,
            },
          },
          author: {
            select: {
              id: true,
              email: true,
              username: true,
              Profil: {
                select: {
                  id: true,
                },
              },
            },
          },
          createdAt: true,
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async updateMessage({
    id,
    message,
  }: {
    id: number;
    message: Partial<Message>;
  }): Promise<boolean> {
    try {
      const msg = await prisma.message.findUniqueOrThrow({
        where: { id },
        select: { id: true },
      });
      if (msg) {
        return (
          (await prisma.message.update({
            where: { id },
            data: message,
            select: {
              id: true,
            },
          })) !== null
        );
      }
      return false;
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async getMessageById(id: number) {
    try {
      return await prisma.message.findUnique({
        where: { id },
        select: {
          id: true,
          content: true,
          attachments: {
            select: {
              id: true,
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              email: true,
              Profil: {
                select: {
                  id: true,
                },
              },
            },
          },
          createdAt: true,
        }
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async getAllMessages() {
    try {
      return await prisma.message.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async updateMessageAttachments({
    id,
    attachments,
  }: {
    id: number;
    attachments: Omit<
      Attachment,
      "id" | "createdAt" | "updatedAt" | "messageId"
    >[];
  }) {
    try {
      const msg = await prisma.message.findUniqueOrThrow({
        where: { id },
        select: { id: true, attachments: true },
      });

      if (msg) {
        if (msg.attachments.length !== 0) {
          await prisma.message.update({
            where: { id },
            data: {
              attachments: {
                deleteMany: {
                  id: {
                    in: msg.attachments.map((attachment) => attachment.id),
                  },
                },
              },
            },
            select: {
              id: true,
            },
          });
        }
        return (
          (await prisma.message.update({
            where: { id },
            data: {
              attachments: {
                createMany: {
                  data: attachments,
                },
              },
            },
            select: {
              id: true,
            },
          })) !== null
        );
      }
      return false;
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async updateMessageIsViewed({
    id,
  }: {
    id: number;
  }): Promise<boolean> {
    try {
      const msg = await prisma.message.findUniqueOrThrow({
        where: { id },
        select: { id: true, isViewed: true },
      });

      if (msg) {
        return (
          (await prisma.message.update({
            where: { id },
            data: { isViewed: true },
            select: {
              id: true,
            },
          })) !== null
        );
      }
      return false;
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async getMessagesByChatId(chatId: number) {
    try {
      return await prisma.message.findMany({
        where: { chatId },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async getLastMessageByChatId(chatId: number) {
    try {
      return (
        await prisma.message.findMany({
          where: { chatId },
          orderBy: { createdAt: "desc" },
          select: {
            content: true,
            createdAt: true,
            updatedAt: true,
          },
          take: 1,
        })
      ).at(-1);
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async deleteMessage({ id }: { id: number }): Promise<boolean> {
    try {
      const msg = await prisma.message.findUniqueOrThrow({
        where: { id },
        select: { id: true },
      });
      if (msg) {
        return (
          (await prisma.message.delete({
            where: { id },
            select: {
              id: true,
            },
          })) !== null
        );
      }
      return false;
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}
