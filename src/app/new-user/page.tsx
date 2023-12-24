import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

const createNewUser = async () => {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const match = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  if (!match) {
    await db.insert(users).values({
      email: user.emailAddresses[0]?.emailAddress ?? user.username,
      clerkId: user.id,
    });
  }

  redirect("/journal");
};

const NewUserPage = async () => {
  await createNewUser();

  return <div>Loading...</div>;
};

export default NewUserPage;
