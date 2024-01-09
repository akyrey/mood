"use client";

import { Analysis } from "@prisma/client";

type AnalysisProps = {
  analysis: Analysis;
};

const Analysis = ({ analysis }: AnalysisProps) => {
  const analysisData = [
    { name: "Summary", value: analysis.summary },
    { name: "Subject", value: analysis.subject },
    { name: "Mood", value: analysis.mood },
    { name: "Negative", value: analysis.negative ? "True" : "False" },
  ];

  return (
    <>
      <div className="px-6 py-10" style={{ backgroundColor: analysis.color }}>
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
    </>
  );
};

export default Analysis;
