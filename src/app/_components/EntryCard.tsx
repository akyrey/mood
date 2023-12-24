import type { JournalEntry } from "~/server/db/schema";

const EntryCard = ({ entry }: { entry: JournalEntry }) => {
  return <div>{entry.id}</div>;
};

export default EntryCard;
