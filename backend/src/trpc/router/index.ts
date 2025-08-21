import z from "zod";
import { publicProcedure, router } from "../server";
import UserService from "@/services/user.service";
import ChatService from "@/services/chat.service";
import { convertChatDetailToChatDetailDto, convertLoginDetailToLoginDetailDto, convertUserFriendDetailToUserFriendDetailDto } from "@/util";
import 'dotenv/config';


const port = process.env.PORT;
const host = process.env.HOST;
const protocol = process.env.PROTOCOL;

 const appRouter = router({
  addUser: publicProcedure
    .input(z.object({
      email: z.email().nonempty('Email is required'),
      password: z.string().min(2).max(100).nonempty('Password is required'),
    }))
    .mutation(async ({ input }) => {
      const user = await UserService.addUser({user: input});
      return user;
    }),
    updateUser: publicProcedure
    .input(z.object({
      id: z.number().min(1),
      email: z.email().optional(),
      phone: z.string().min(10).max(15).optional(),
      username: z.string().min(2).max(100).optional(),
      firstname: z.string().min(2).max(100).optional(),
      lastname: z.string().min(2).max(100).optional(),
    }))
    .mutation(async ({ input }) => {
      const user = await UserService.updateUser({ id: input.id, user: input });
      return user;
    }),
    getUserById: publicProcedure
    .input(z.object({
      id: z.number().min(1),
    }))
    .query(async ({ input }) => {
      const user = await UserService.getUserById(input.id);
      return user;
    }),
    getAllUsers: publicProcedure
    .query(async () => {
      const users = await UserService.getAllUsers();
      return users;
    }),
    getNumberOfChatsByUserId: publicProcedure
    .input(z.object({
      id: z.number().min(1),
    }))
    .query(async ({ input }) => {
      const count = await ChatService.getNumberOfChatsByUserId(input.id);
      return count;
    }),
    getChatsByUserId: publicProcedure
    .input(z.object({
      id: z.number().min(1),
    }))
    .query(async ({ input }) => {
      const chats = await ChatService.getChatsByUserId(input.id);
      return chats;
    }),
    getChatById: publicProcedure
    .input(z.object({
      id: z.number().min(1),
    }))
    .query(async ({ input }) => {
      const chat = await ChatService.getChatById(input.id);
      return convertChatDetailToChatDetailDto(protocol!,`${host}:${port}`, chat);
    }),

    updateUserFriends: publicProcedure
    .input(z.object({
      userId: z.number().min(1),
      friendIds: z.array(z.number().min(1)),
    }))
    .mutation(async ({ input }) => {
      const { userId, friendIds } = input;
      const result = await UserService.updateUserFriends({ id: userId, friends:friendIds });
      return result;
    }),

    getUserFriends: publicProcedure
    .input(z.object({
      userId: z.number().min(1),
    }))
    .query(async ({ input }) => {
      const { userId } = input;
      const friends = await UserService.getUserFriends(userId);
      return convertUserFriendDetailToUserFriendDetailDto(protocol!,`${host}:${port}`, friends);
    }),

    login: publicProcedure
    .input(z.object({
      email: z.email().nonempty('Email is required'),
      password: z.string().min(6).max(100).nonempty('Password is required'),
    }))
    .mutation(async ({ input }) => {
      const user = await UserService.login(input);
      return convertLoginDetailToLoginDetailDto(protocol!,`${host}:${port}`, user);
    }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

export default appRouter;