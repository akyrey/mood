import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users, type User } from "~/server/db/schema";

export const getUserByClerkId = async (opts?: {
  select?: Record<keyof User, boolean>;
  include?: Record<"journalEntries", true>;
}): Promise<User> => {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error("No Clerk ID found");
  }

  const user = await db.query.users.findFirst({
    columns: opts?.select,
    where: eq(users.clerkId, clerkId),
    with: opts?.include,
  });

  if (!user) {
    throw new Error(`No user found for Clerk ID ${clerkId}`);
  }

  return user;
};
