import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

const createNewUser = async () => {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const match = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!match) {
    await db.user.create({
      data: {
        email: user.emailAddresses[0]?.emailAddress ?? user.username ?? "",
        clerkId: user.id,
      },
    });
  }

  redirect("/journal");
};

const NewUserPage = async () => {
  await createNewUser();

  return <div>Loading...</div>;
};

export default NewUserPage;
