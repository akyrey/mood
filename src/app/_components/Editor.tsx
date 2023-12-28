"use client";

import type { JournalEntry } from "@prisma/client";
import { useState } from "react";
import { useAutosave } from "react-autosave";
import { api } from "~/trpc/react";
import Spinner from "./Spinner";

type EditorProps = {
  entry: JournalEntry;
};

const Editor = ({ entry }: EditorProps) => {
  const { mutate, isLoading: isSaving } = api.journal.update.useMutation();
  const [value, setValue] = useState(entry.content);
  useAutosave({
    data: value,
    onSave: (content: string) => {
      if (content !== entry.content) {
        mutate({ id: entry.id, content });
      }
    },
  });

  return (
    <div className="h-full w-full">
      <textarea
        className="h-full w-full p-8 text-xl outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
      {isSaving && (
        <Spinner className="fixed bottom-12 right-12 text-red-400" />
      )}
    </div>
  );
};

export default Editor;
