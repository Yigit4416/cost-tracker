import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { expensesTable } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getUser } from "../kinde";

const createExpenseSchema = z.object({
  title: z.string().min(3).max(100),
  amount: z.number().positive().finite(),
  created_at: z.coerce.date(),
});

type ExpenseRow = typeof expensesTable.$inferSelect;

function serializeExpense(expense: ExpenseRow) {
  return {
    ...expense,
    amount: Number(expense.amount),
  };
}

function parseExpenseId(id: string) {
  const numberId = Number(id);
  return Number.isInteger(numberId) && numberId > 0 ? numberId : null;
}

const expenses = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.get("user");

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, `${user.id}`))
      .orderBy(desc(expensesTable.created_at));

    return c.json({ expenses: expenses.map(serializeExpense) });
  })
  .get("/total-spent", getUser, async (c) => {
    const user = c.get("user");

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, `${user.id}`));

    const totalSpent = expenses.reduce((a, b) => {
      const amount = Number(b.amount);
      return a + amount;
    }, 0);
    c.status(200);
    return c.json({ totalSpent });
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const user = c.get("user");
    const expense = c.req.valid("json");
    const createdExpense = await db
      .insert(expensesTable)
      .values({
        userId: `${user.id}`,
        title: expense.title,
        amount: expense.amount.toFixed(2),
        created_at: expense.created_at,
      })
      .returning();

    if (!createdExpense) {
      return c.json({ error: "Could not create expense" }, 500);
    }

    c.status(201);
    const serializedExpense = createdExpense.map((data) => {
      return serializeExpense(data);
    });
    return c.json({
      expense: serializedExpense,
    });
  })
  .get("/:id", getUser, async (c) => {
    const user = c.get("user");
    const numberId = parseExpenseId(c.req.param("id"));
    if (!numberId) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const [expense] = await db
      .select()
      .from(expensesTable)
      .where(
        and(
          eq(expensesTable.id, numberId),
          eq(expensesTable.userId, `${user.id}`),
        ),
      );

    if (!expense) return c.notFound();
    return c.json({ expense: serializeExpense(expense) });
  })
  .delete("/:id", getUser, async (c) => {
    const user = c.get("user");
    const numberId = parseExpenseId(c.req.param("id"));
    if (!numberId) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const [expense] = await db
      .delete(expensesTable)
      .where(
        and(
          eq(expensesTable.id, numberId),
          eq(expensesTable.userId, `${user.id}`),
        ),
      )
      .returning();

    if (!expense) return c.notFound();
    return c.json({ expense: serializeExpense(expense) });
  });

export default expenses;
