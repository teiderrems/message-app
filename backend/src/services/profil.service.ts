import prisma from "@/db/client";
import { Prisma, Profil } from "@/generated/prisma";

export default class ProfilService {

    static async createProfil(userId: number, data: Omit<Profil, "id" | "createdAt" | "updatedAt"| "userId">) {
        try {
            return await prisma.profil.create({
                data: {
                    userId,
                    ...data
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

    static async updateProfil(id: number, data: Partial<Omit<Profil, "id" | "createdAt" | "updatedAt"| "userId">>) {
        try {
            return await prisma.profil.update({
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

    static async getProfilById(id: number) {
        try {
            return await prisma.profil.findUnique({
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

    static async deleteProfil(id: number) {
        try {
            return await prisma.profil.delete({
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
