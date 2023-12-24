import { desc, eq } from "drizzle-orm";
import EntryCard from "~/app/_components/EntryCard";
import NewEntryCard from "~/app/_components/NewEntryCard";
import { db } from "~/server/db";
import { journalEntries, type JournalEntry } from "~/server/db/schema";
import { getUserByClerkId } from "~/utils/auth";

const getEntries = async () => {
  const user = await getUserByClerkId();
  const entries = await db.query.journalEntries.findMany({
    where: eq(journalEntries.userId, user.id),
    orderBy: [desc(journalEntries.createdAt)],
  });

  return entries;
};

const JournalPage = async () => {
  const entries = await getEntries();

  return (
    <div className="h-full bg-zinc-400/10 p-10">
      <h2 className="mb-8 text-3xl">Journal</h2>
      <div className="grid grid-cols-3 gap-4">
        <NewEntryCard />
        {entries.map((entry: JournalEntry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
