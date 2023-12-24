// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  mysqlTableCreator,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `mood_${name}`);

export const User = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  clerkId: z.string(),
  email: z.string().email(),
});
export type User = z.infer<typeof User>;
export const users = mysqlTable("user", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),

  clerkId: varchar("clerk_id", { length: 36 }).notNull().unique(),
  email: varchar("email", { length: 256 }).notNull().unique(),
});
export const usersRelations = relations(users, ({ many }) => ({
  journalEntries: many(journalEntries),
}));

export const JournalEntry = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  content: z.string(),
  userId: z.string().uuid(),
});
export type JournalEntry = z.infer<typeof JournalEntry>;
export const journalEntries = mysqlTable(
  "journal_entry",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),

    content: text("content").notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
  },
  (table) => ({
    userId: index("user_id").on(table.userId),
  }),
);
export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  user: one(users, {
    fields: [journalEntries.userId],
    references: [users.id],
  }),
  analysis: one(analyses, {
    fields: [journalEntries.id],
    references: [analyses.entryId],
  }),
}));

export const analyses = mysqlTable(
  "analysis",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),

    entryId: varchar("entry_id", { length: 36 }).unique(),

    mood: varchar("mood", { length: 256 }),
    summary: text("summary"),
    color: varchar("color", { length: 7 }),
    negative: boolean("negative"),
  },
  (table) => ({
    entryId: uniqueIndex("entry_id").on(table.entryId),
  }),
);
export const analysesRelations = relations(analyses, ({ one }) => ({
  entry: one(journalEntries, {
    fields: [analyses.entryId],
    references: [journalEntries.id],
  }),
}));
