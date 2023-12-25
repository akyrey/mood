"use client";

import type { JournalEntry } from "@prisma/client";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const NewEntryCard = () => {
  const router = useRouter();
  const { mutate, isLoading } = api.journal.create.useMutation({
    onSuccess: (entry: JournalEntry) => {
      router.push(`/journal/${entry.id}`);
    },
  });

  const handleOnClick = () => {
    mutate({ content: "My example content" });
  };

  return (
    <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow disabled:cursor-not-allowed disabled:opacity-30">
      <button
        type="button"
        className="px-4 py-5 sm:p-6"
        disabled={isLoading}
        onClick={handleOnClick}
      >
        <span className="text-3xl">New Entry</span>
      </button>
    </div>
  );
};

export default NewEntryCard;
