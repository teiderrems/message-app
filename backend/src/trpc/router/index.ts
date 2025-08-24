import z from "zod";
import { publicProcedure, router } from "../server";
import UserService from "@/services/user.service";
import ChatService from "@/services/chat.service";
import {
  convertChatDetailToChatDetailDto,
  convertUserDetailToUserDetailDto,
  convertUserFriendDetailToUserFriendDetailDto,
  convertUserFriendOfDetailToUserFriendDetailDto,
} from "@/util";
import "dotenv/config";
import MessageService from "@/services/message.service";

const port = process.env.PORT;
const host = process.env.HOST;
const protocol = process.env.PROTOCOL;

const userRouter = router({
  addUser: publicProcedure
    .input(
      z.object({
        email: z.email().nonempty("Email is required"),
        password: z.string().min(2).max(100).nonempty("Password is required"),
      })
    )
    .mutation(async ({ input }) => {
      const user = await UserService.addUser({ user: input });
      return convertUserDetailToUserDetailDto(
        protocol!,
        `${host}:${port}`,
        user
      );
    }),
  updateUser: publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
        email: z.email().optional(),
        phone: z.string().min(10).max(15).optional(),
        username: z.string().min(2).max(100).optional(),
        firstname: z.string().min(2).max(100).optional(),
        lastname: z.string().min(2).max(100).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await UserService.updateUser({ id: input.id, user: input });
      return user;
    }),
  getUserById: publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const user = await UserService.getUserById(input.id);
      return user;
    }),
  getAllUsers: publicProcedure.query(async () => {
    const users = await UserService.getAllUsers();
    return users;
  }),
  updateUserFriends: publicProcedure
    .input(
      z.object({
        userId: z.number().min(1),
        friendIds: z.array(z.number().min(1)),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, friendIds } = input;
      const result = await UserService.acceptFriendRequest({
        userId,
        friendId: friendIds,
      });
      return result;
    }),

  getUserFriends: publicProcedure
    .input(
      z.object({
        userId: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
      const friends = await UserService.getUserFriends(userId);
      return convertUserFriendOfDetailToUserFriendDetailDto(
        protocol!,
        `${host}:${port}`,
        friends
      );
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.email().nonempty("Email is required"),
        password: z.string().min(6).max(100).nonempty("Password is required"),
      })
    )
    .mutation(async ({ input }) => {
      const user = await UserService.login(input);
      return convertUserDetailToUserDetailDto(
        protocol!,
        `${host}:${port}`,
        user
      );
    }),

  sendFriendRequest: publicProcedure
    .input(
      z.object({
        userId: z.number().min(1),
        friendId: z.array(z.number().min(1)),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, friendId } = input;
      const result = await UserService.sendFriendRequest({ userId, friendId });
      return result;
    }),
  declineFriendRequest: publicProcedure
    .input(
      z.object({
        userId: z.number().min(1),
        friendId: z.array(z.number().min(1)),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, friendId } = input;
      const result = await UserService.declineFriendRequest({
        userId,
        friendId,
      });
      return result;
    }),
  removeFriend: publicProcedure
    .input(
      z.object({
        userId: z.number().min(1),
        friendId: z.array(z.number().min(1)),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, friendId } = input;
      const result = await UserService.removeFriend({ userId, friendId });
      return result;
    }),
  getAllUserFriends: publicProcedure
    .input(
      z.object({
        userId: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
      const friends = await UserService.getUserFriends(userId);
      return convertUserFriendOfDetailToUserFriendDetailDto(
        protocol!,
        `${host}:${port}`,
        friends
      );
    }),
  getUserFriendRequests: publicProcedure
    .input(
      z.object({
        userId: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
      const friendRequests = await UserService.getUserFriendRequests(userId);
      return convertUserFriendOfDetailToUserFriendDetailDto(
        protocol!,
        `${host}:${port}`,
        friendRequests
      );
    }),
  getFriendRequests: publicProcedure
    .input(
      z.object({
        userId: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
      const friendRequests = await UserService.getFriendRequests(userId);
      return convertUserFriendDetailToUserFriendDetailDto(
        protocol!,
        `${host}:${port}`,
        friendRequests
      );
    }),
  changeOnlineStatus: publicProcedure
    .input(
      z.object({
        userId: z.number().min(1),
        isOnline: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, isOnline } = input;
      const result = await UserService.changeOnlineStatus({
        id: userId,
        isOnline,
      });
      return result !== null;
    }),
    getUserStatus: publicProcedure
      .input(
        z.object({
          userId: z.number().min(1),
        })
      )
      .query(async ({ input }) => {
        const { userId } = input;
        const isOnline = await UserService.getUserStatus(userId);
        return isOnline;
      }),
});

const chatRouter = router({
  getChatsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
      const chats = await ChatService.getChatsByUserId(userId);
      return chats.map((chat) => ({
        id: chat.id,
        description: chat.description,
        avatar: chat.description
          ? chat.description.charAt(0).toUpperCase()
          : "C",
        updatedAt: chat.updatedAt,
      }));
    }),
  getChatById: publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
        userId: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const chat = await ChatService.getChatById(input.id);
      return convertChatDetailToChatDetailDto(
        protocol!,
        `${host}:${port}`,
        chat,
        input.userId
      );
    }),
  createChat: publicProcedure
    .input(
      z.object({
        authorId: z.number().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const chat = await ChatService.addChat({ chat: input });
      return chat !== null;
    }),
  updateChat: publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const chat = await ChatService.updateChat({ id: input.id, chat: input });
      return chat !== null;
    }),
  deleteChat: publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const deleted = await ChatService.deletechat({ id: input.id });
      return deleted;
    }),
  addUserInChat: publicProcedure
    .input(
      z.object({
        userIds: z.array(z.number()).min(1),
        chatId: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { userIds, chatId } = input;
      const result = await ChatService.addUserToChat({
        userId: userIds,
        chatId,
      });
      return result;
    }),
});

const messageRouter = router({
  changeViewStatus: publicProcedure
    .input(
      z.object({
        messageId: z.number().min(1),
        userId: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { messageId,userId } = input;
      const result = await MessageService.updateMessageIsViewed({
        id: messageId,
        userId,
      });
      return result !== null;
    }),
    deleteMessage: publicProcedure
      .input(
        z.object({
          id: z.number().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const { id } = input;
        const result = await MessageService.deleteMessage({ id });
        return result !== null;
      }),
      updateMessage: publicProcedure
        .input(
          z.object({
            id: z.number().min(1),
            content: z.string().min(1).max(500),
          })
        )
        .mutation(async ({ input }) => {
          const { id, content } = input;
          const result = await MessageService.updateMessage({ id, message: { content } });
          return result !== null;
        }),
});

const appRouter = router({
  user: userRouter,
  chat: chatRouter,
  message: messageRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
