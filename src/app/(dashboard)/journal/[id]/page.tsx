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
  const analysisData = [
    { name: "Summary", value: "This is a summary of your entry" },
    { name: "Subject", value: "" },
    { name: "Mood", value: "" },
    { name: "Negative", value: false },
  ];

  return (
    <div className="grid h-full w-full grid-cols-3">
      <div className="col-span-2">
        <Editor entry={entry} />
      </div>
      <div className="border-l border-black/10">
        <div className="bg-blue-300 px-6 py-10">
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li
                className="flex items-center justify-between border-b border-t border-black/10 px-2 py-4"
                key={item.name}
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
