import prisma from "@/db/client";
import { type Chat, Prisma } from "@/generated/prisma";

export default class ChatService {
  static async getChatsByUserId(id: number) {
    try {
      return await prisma.chat.findMany({
        where: { 
          OR:[
            { authorId: id },
            { UserChat: { some: { userId: id } } }
          ]
        },
        include:{
          messages:{
            select:{
              isViewed:true,
              author:{
                select:{
                  id:true,
                  username:true,
                  email:true,
                  Profil:{
                    select:{
                      id:true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy:{
          updatedAt:'desc'
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
            include: {
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
            orderBy:{
              createdAt:'asc'
            }
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

  static async addChat({ chat,destinatorId }: { chat: Partial<Chat>;destinatorId:number }) {
    try {
      return await prisma.chat.create({
        data: {
          description: chat.description,
          author: {
            connect: {
              id: chat.authorId,
            },
          },
          UserChat:{
            createMany:{
              data:[
                {
                  userId:chat.authorId!,
                },
                {
                  userId:destinatorId
                }
              ]
            }
          }
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

  static async updateChat({ id, chat }: { chat: Partial<Chat>; id: number }) {
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
      const chat = await prisma.userChat.findMany({
        where: { 
          AND:[
            { userId: userId },
            { chatId: chatId }  
          ]
        },
        select: {
          id: true,
        },
      });
      return chat.length > 0;
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
    userId: number[];
    chatId: number;
  }) {
    const userIds = userId.filter(async (id) => {
      try {
        const isInChat = await this.isUserInChat({ userId: id, chatId });
        console.log(isInChat);
        return !isInChat;
      } catch (error) {
        console.error(error);
        return false;
      }
    });
    try {
      console.log(userIds, userId);
      if (userIds.length > 0) {
        await prisma.userChat.createMany({
          data: userIds.map((id) => ({
            userId: id,
            chatId: chatId,
          })),
        });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}
