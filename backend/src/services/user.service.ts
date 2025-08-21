import prisma from "@/db/client";
import { Prisma, Profil, User } from "@/generated/prisma";
import { setPassword } from "@/util";
import { compare } from "bcrypt";

export default class UserService {
  static async getUserFriends(userId: number) {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          friends: {
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
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }


  static async addUser({
    user,
    profil,
  }: {
    user: Partial<User>;
    profil?: Omit<Profil, "id"|"createdAt"|"updatedAt"| "userId">;
  }) {
    try {
      if (profil) {
        const result = await prisma.profil.create({
          data: profil,
          select: { id: true },
        });
        return await prisma.user.create({
          data: {
            ...setPassword(user),
            Profil: {
              connect: { id: result.id },
            },
          },
        });
      }
      return await prisma.user.create({
        data: setPassword(user),
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async updateUser({
    id,
    user
  }: {
    id: number;
    user: Partial<User>;
  }) {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          ...user,
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


  static async getUserById(id: number) {
    try {
      return await prisma.user.findUnique({
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

  static async getAllUsers() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async updateUserFriends({
    id,
    friends
  }: {
    id: number;
    friends: number[];
  }) {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          friends:{
            connect: friends.map(friendId => ({ id: friendId })),
          }
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

  static async updateUserProfile({
    id,
    profile
  }: {
    id: number;
    profile: Omit<Profil, "id"|"createdAt"|"updatedAt"| "userId">;
  }) {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id },
        select:{Profil: true, id: true}
      });

      if (!user) {
        throw new Error("User not found");
      }
      if (!user.Profil) {
        const result = await prisma.profil.create({
          data: profile,
          select: { id: true },
        });
        return await prisma.user.update({
          where: { id },
          data: {
            Profil: {
              connect: { id: result.id },
            },
          },
        });
      }
      return await prisma.profil.update({
        where: { id: user.Profil.id },
        data: {
          ...profile,
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

  static async login({
    email,
    password
  }: {
    email: string;
    password: string;
  }) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select:{
          id: true,
          email: true,
          phone: true,
          firstname: true,
          lastname: true,
          createdAt: true,
          updatedAt: true,
          password: true,
          Profil:{
            select:{
              id: true,
            }
          }
        }
      });
      if (!user) {
        throw new Error("User not found");
      }
      if (!user.password) {
        throw new Error("User not found");
      }
      const isValid = await compare(password, user.password);
      if (!isValid) {
        throw new Error("Invalid password");
      }
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async deleteUser({
    id
  }: {
    id: number;
  }) {
    try {
      return await prisma.user.delete({
        where: { id }
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
