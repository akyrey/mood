import type { JournalEntry } from "@prisma/client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const EntryCard = ({ entry }: { entry: JournalEntry }) => {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">
        {dayjs(entry.createdAt).fromNow()}
      </div>
      <div className="px-4 py-5 sm:p-6">{entry.analysis?.summary}</div>
      <div className="px-4 py-5 sm:px-6">{entry.analysis?.mood}</div>
    </div>
  );
};

export default EntryCard;
