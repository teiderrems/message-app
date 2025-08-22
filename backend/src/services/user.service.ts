import prisma from "@/db/client";
import { Prisma, Profil, User } from "@/generated/prisma";
import { setPassword } from "@/util";
import { compare } from "bcrypt";

export default class UserService {
  static async getUserFriends(userId: number) {
    try {
      return await prisma.user.findUnique({
        where: {
          id: userId,
          friendOf: {
            some: {
              accepted: true,
            },
          },
        },
        select: {
          friendOf: {
            select: {
              id: true,
              user: {
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

  static async getUserFriendRequests(userId: number) {
    try {
      return await prisma.user.findUnique({
        where: {
          id: userId,
          friendOf: {
            some: {
              accepted: false,
            },
          },
        },
        select: {
          friendOf: {
            select: {
              id: true,
              user: {
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

  static async acceptFriendRequest({
    userId,
    friendId,
  }: {
    userId: number;
    friendId: number[];
  }) {
    try {
      return (
        (
          await prisma.userFriend.updateMany({
            where: {
              userId,
              friendId: {
                in: friendId,
              },
            },
            data: {
              accepted: true,
            },
          })
        ).count > 0
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async sendFriendRequest({
    userId,
    friendId,
  }: {
    userId: number;
    friendId: number[];
  }) {
    try {
      return (
        (
          await prisma.userFriend.createMany({
            data: friendId.map((id) => ({
              userId,
              friendId: id,
            })),
          })
        ).count > 0
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async getFriendRequests(userId: number) {
    try {
      return await prisma.user.findUnique({
        where: {
          id: userId,
          friends: {
            some: {
              accepted: false,
            },
          },
        },
        select: {
          friends: {
            select: {
              id: true,
              user: {
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

  static async declineFriendRequest({
    userId,
    friendId,
  }: {
    userId: number;
    friendId: number[];
  }) {
    try {
      return (
        (
          await prisma.userFriend.updateMany({
            where: {
              userId,
              friendId: {
                in: friendId,
              },
            },
            data: {
              accepted: false,
            },
          })
        ).count > 0
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async removeFriend({
    userId,
    friendId,
  }: {
    userId: number;
    friendId: number[];
  }) {
    try {
      return (
        (
          await prisma.userFriend.deleteMany({
            where: {
              userId,
              friendId: {
                in: friendId,
              },
            },
          })
        ).count > 0
      );
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
    profil?: Omit<Profil, "id" | "createdAt" | "updatedAt" | "userId">;
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
          include: {
            Profil: {
              select: {
                id: true,
              },
            },
          },
        });
      }
      return await prisma.user.create({
        data: setPassword(user),
        include: {
          Profil: {
            select: {
              id: true,
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

  static async updateUser({ id, user }: { id: number; user: Partial<User> }) {
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

  static async updateUserProfile({
    id,
    profile,
  }: {
    id: number;
    profile: Omit<Profil, "id" | "createdAt" | "updatedAt" | "userId">;
  }) {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id },
        select: { Profil: true, id: true },
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

  static async getUserStatus(id: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { isOnline: true },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user.isOnline;
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async login({ email, password }: { email: string; password: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          Profil: {
            select: {
              id: true,
            },
          },
        },
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


  static async changeOnlineStatus({ id, isOnline }: { id: number; isOnline: boolean }) {
    try {
      return await prisma.user.update({
        where: { id },
        data: { isOnline: isOnline },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async forgetPassword({ email }: { email: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!user) {
        throw new Error("User not found");
      }
      // Generate a password reset token and send it to the user's email
      // const token = await generatePasswordResetToken(user.id);
      // await sendPasswordResetEmail(user.email, token);
      return true;
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async resetPassword({
    userId,
    newPassword,
  }: {
    userId: number;
    newPassword: string;
  }) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error("Invalid or expired token");
      }
      await prisma.user.update({
        where: { id: userId },
        data: setPassword(user, newPassword),
      });
      return true;
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  static async deleteUser({ id }: { id: number }) {
    try {
      return await prisma.user.delete({
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
