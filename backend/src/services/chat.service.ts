import prisma from "@/db/client";
import { type Chat, Prisma } from "@/generated/prisma";

export default class ChatService {
  static async getChatsByUserId(id: number) {
      try {
        return await prisma.chat.findMany({
          where: { authorId: id },
        });
      } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new Error(error.message);
        }
        throw error;
      }
  }


  static async getChatById(id: number) {
    try {
      return await prisma.chat.findUnique({
        where: { id },
        select: {
          id: true,
          author: {
            select: {
              id: true,
              username: true,
              Profil: {
                select: {
                  id: true,
                },
              },
            },
          },
          messages: {
            select: {
              id: true,
              content: true,
              createdAt: true,
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
            },
          },
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

  static async getNumberOfChatsByUserId(userId: number) {
    try {
      return await prisma.chat.count({
        where: {
          authorId: userId,
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

  static async getNumberOfMessageWhichIsNotViewed(chatId: number) {
    try {
      return await prisma.message.count({
        where: {
          chatId,
          isViewed: false,
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

  static async addchat({ chat }: { chat: Partial<Chat> }) {
    try {
      return await prisma.chat.create({
        data: {
          description: chat.description,
          author: {
            connect: {
              id: chat.authorId,
            },
          },
        },
        select: {
          id: true,
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

  static async updateChat({
    id,
    chat,
  }: {
    chat: Partial<Chat>;
    id: number;
  }) {
    try {
      return await prisma.chat.update({
        where: { id },
        data: {
          ...chat,
        },
        select: {
          id: true,
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

  static async deletechat({ id }: { id: number }): Promise<boolean> {
    try {
      const msg = await prisma.chat.findUniqueOrThrow({
        where: { id },
        select: { id: true },
      });
      if (msg) {
        return (
          (await prisma.chat.delete({
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

  static async isUserInChat({
    userId,
    chatId,
  }: {
    userId: number;
    chatId: number;
  }) {
    try {
      const chat = await prisma.userChat.findUnique({
        where: { id: chatId, userId: userId },
        select: {
          id: true,
        },
      });
      return chat?.id !== undefined;
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async addUserToChat({
    userId,
    chatId,
  }: {
    userId: number;
    chatId: number;
  }) {
    try {
      await prisma.userChat.create({
        data: {
          user: {
            connect: { id: userId },
          },
          chat: {
            connect: { id: chatId },
          },
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
}
