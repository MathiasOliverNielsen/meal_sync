// Prisma database utilities for user management
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// User service - manages user profile data in Prisma
export async function createUserProfile(supabaseUserId: string, email: string, username: string) {
  return await prisma.user.create({
    data: {
      supabaseUserId,
      email,
      username,
    },
  });
}

export async function getUserBySupabaseId(supabaseUserId: string) {
  return await prisma.user.findUnique({
    where: { supabaseUserId },
  });
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function deleteUserProfile(supabaseUserId: string) {
  return await prisma.user.delete({
    where: { supabaseUserId },
  });
}
