import { index, numeric, pgTable, serial, text } from "drizzle-orm/pg-core";

export const expensesTable = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => {
    return {
      userIdIndex: index("user_id_index").on(table.userId), // This is for index
    };
  },
);
