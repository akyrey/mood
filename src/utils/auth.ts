import { auth } from "@clerk/nextjs";
import type { User } from "@prisma/client";
import { db } from "~/server/db";

export const getUserByClerkId = async (): Promise<User> => {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error("No Clerk ID found");
  }

  return await db.user.findUniqueOrThrow({
    where: {
      clerkId,
    },
  });
};
