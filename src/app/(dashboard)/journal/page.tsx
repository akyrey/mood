import type { JournalEntry } from "@prisma/client";
import Link from "next/link";
import EntryCard from "~/app/_components/EntryCard";
import NewEntryCard from "~/app/_components/NewEntryCard";
import { api } from "~/trpc/server";

const JournalPage = async () => {
  const entries = await api.journal.getAll.query();

  return (
    <div className="h-full bg-zinc-400/10 p-10">
      <h2 className="mb-8 text-3xl">Journal</h2>
      <div className="grid grid-cols-3 gap-4">
        <NewEntryCard />
        {entries.map((entry: JournalEntry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
