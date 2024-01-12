import type { JournalEntry } from "@prisma/client";
import { loadQARefineChain } from "langchain/chains";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { z } from "zod";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe("The mood of the person who wrote the journal entry."),
    summary: z.string().describe("Quick summary of the entire entry."),
    subject: z.string().describe("The subject of the journal entry."),
    color: z
      .string()
      .describe(
        "An hexadecimal color code that represents the mood of the entry. Example #0101FE for blue representing happiness.",
      ),
    negative: z
      .boolean()
      .describe(
        "Is the journal entry negative? (i.e. does it contain negative emotions?)",
      ),
  }),
);

const getPrompt = async (content: string) => {
  const formattedInstructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template: `Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what!\n{formattedInstructions}\n{entry}`,
    inputVariables: ["entry"],
    partialVariables: { formattedInstructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyze = async (content: string) => {
  const input = await getPrompt(content);
  const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
  const result = await model.call(input);

  try {
    return parser.parse(result);
  } catch (err) {
    console.log(err);
    // return null;
  }
};

export const qa = async (
  question: string,
  entries: Pick<JournalEntry, "id" | "content" | "createdAt">[],
): Promise<string> => {
  const docs: Document[] = entries.map(
    (entry: Pick<JournalEntry, "id" | "content" | "createdAt">) =>
      new Document({
        pageContent: entry.content,
        metadata: { id: entry.id, createdAt: entry.createdAt },
      }),
  );

  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);

  const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
  const chain = loadQARefineChain(model);
  const result = await chain.call({
    input_documents: relevantDocs,
    question,
  });

  // TODO: check how to type this correctly
  return result.output_text as string;
};
