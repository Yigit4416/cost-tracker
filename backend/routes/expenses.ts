import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const expenseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3).max(100),
  amount: z.number().positive(),
});

const createExpenseSchema = expenseSchema.omit({ id: true });

type Expense = z.infer<typeof expenseSchema>;

const fakeExpenses: Expense[] = [
  { id: 1, title: "Rent", amount: 1200 },
  { id: 2, title: "Groceries", amount: 215.34 },
  { id: 3, title: "Coffee", amount: 4.5 },
  { id: 4, title: "Internet", amount: 60 },
  { id: 5, title: "Electricity", amount: 89.12 },
  { id: 6, title: "Gym Membership", amount: 29.99 },
  { id: 7, title: "Streaming Subscriptions", amount: 15.98 },
  { id: 8, title: "Transportation", amount: 48.75 },
  { id: 9, title: "Dining Out", amount: 67.25 },
  { id: 10, title: "Medical", amount: 150 },
];

const expenses = new Hono();

expenses.get("/", (c) => {
  return c.json({ expenses: fakeExpenses });
});

expenses.get("/total-spent", async (c) => {
  let x = fakeExpenses.reduce((a, b) => {
    return a + b.amount;
  }, 0);
  c.status(200);
  return c.json({ totalSpent: x });
});

expenses.post("/", zValidator("json", createExpenseSchema), async (c) => {
  const expense = c.req.valid("json");
  fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
  c.status(201);
  return c.json({
    expense,
  });
});

expenses.get("/:id", (c) => {
  const id = c.req.param("id");
  const numberId = parseInt(id);
  if (typeof numberId !== "number") return c.json({ error: "Invalid ID" }, 400);
  const expense = fakeExpenses.find((e) => e.id === numberId);
  if (!expense) return c.notFound();
  return c.json({ expense });
});

expenses.delete("/:id", (c) => {
  const id = c.req.param("id");
  const numberId = parseInt(id);
  if (typeof numberId !== "number") return c.json({ error: "Invalid ID" }, 400);
  const expense = fakeExpenses.find((e) => e.id === numberId);
  if (!expense) return c.notFound();
  fakeExpenses.splice(fakeExpenses.indexOf(expense), 1);
  return c.json({ expense: {} });
});

export default expenses;
