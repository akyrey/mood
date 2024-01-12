"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { api } from "~/trpc/react";
import Spinner from "./Spinner";

const Question = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { refetch } = api.question.ask.useQuery(
    {
      question: value,
    },
    { enabled: false },
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError(null);

    const { error, isError, data } = await refetch();

    if (isError) {
      setError(error.message);
    } else {
      setResult(data ?? null);
    }

    setLoading(false);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Looking for something?"
        className="boder-black/20 rounded-lg border px-4 py-2 text-lg"
        disabled={loading}
        onChange={onChange}
        value={value}
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-400 px-4 py-2 text-lg"
        disabled={loading}
      >
        Ask
      </button>
      {loading && <Spinner className="fixed bottom-12 right-12 text-red-400" />}
      {result && <p>{result}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default Question;
