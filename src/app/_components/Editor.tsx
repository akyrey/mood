"use client";

import type { JournalEntry } from "@prisma/client";
import { useState } from "react";
import { useAutosave } from "react-autosave";
import Analysis from "~/app/_components/Analysis";
import { api } from "~/trpc/react";
import Spinner from "./Spinner";

type EditorProps = {
  entry: JournalEntry;
};

const Editor = ({ entry }: EditorProps) => {
  const ctx = api.useUtils();
  const { mutate, isLoading: isSaving } = api.journal.update.useMutation({
    onSuccess: (updatedEntry: JournalEntry) => {
      void ctx.journal.getOne.invalidate();
      setAnalysis(updatedEntry.analysis);
    },
  });

  const [value, setValue] = useState(entry.content);
  const [analysis, setAnalysis] = useState(entry.analysis);
  useAutosave({
    data: value,
    onSave: (content: string) => {
      if (content !== entry.content) {
        mutate({ id: entry.id, content });
      }
    },
  });

  return (
    <>
      <div className="col-span-2">
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
      </div>
      <div className="border-l border-black/10">
        {analysis ? <Analysis analysis={analysis} /> : null}
      </div>
    </>
  );
};

export default Editor;
