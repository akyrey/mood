import type { JournalEntry } from "@prisma/client";
import Editor from "~/app/_components/Editor";
import { api } from "~/trpc/server";

type EntryPageProps = {
  params: {
    id: string;
  };
};

const EntryPage = async ({ params }: EntryPageProps) => {
  const entry: JournalEntry = await api.journal.getOne.query({ id: params.id });

  return (
    <div className="h-full w-full">
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
