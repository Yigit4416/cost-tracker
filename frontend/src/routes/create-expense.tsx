import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/create-expense")({
  component: RouteComponent,
});

async function createExpense(input: { title: string; amount: number }) {
  const res = await api.expenses.$post({
    json: input,
  });

  if (!res.ok) {
    throw new Error("Could not create expense");
  }

  return res.json();
}

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "",
    },
    onSubmit: async ({ value }) => {
      await createExpense({
        title: value.title.trim(),
        amount: Number(value.amount),
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["expenses"] }),
        queryClient.invalidateQueries({ queryKey: ["get-total-spent"] }),
      ]);
      form.reset();
      navigate({ to: "/expenses" });
    },
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:py-10">
      <section className="space-y-2 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase text-muted-foreground">
          Spending
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Create expense
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Add a new expense with a clear title and amount.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Card>
          <CardHeader>
            <CardTitle>Expense details</CardTitle>
            <CardDescription>
              Keep names short enough to scan in the expenses table.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <form.Field
                name="title"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim()
                      ? "A title is required"
                      : value.trim().length < 3
                        ? "Title must be at least 3 characters"
                        : value.length > 100
                          ? "Title must be 100 characters or less"
                          : undefined,
                }}
                children={(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Title</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Groceries"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />

              <form.Field
                name="amount"
                validators={{
                  onChange: ({ value }) => {
                    const amount = Number(value);
                    return !value
                      ? "An amount is required"
                      : !Number.isFinite(amount)
                        ? "Amount must be a number"
                        : amount <= 0
                          ? "Amount must be greater than zero"
                          : undefined;
                  },
                }}
                children={(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Amount</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      placeholder="24.50"
                      min="0.01"
                      step="0.01"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />

              <form.Subscribe
                selector={(state) => [state.errorMap.onSubmit]}
                children={([submitError]) =>
                  submitError ? (
                    <p className="text-xs text-destructive">
                      {String(submitError)}
                    </p>
                  ) : null
                }
              />

              <div className="flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" asChild>
                  <Link to="/expenses">View Expenses</Link>
                </Button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Expense"}
                    </Button>
                  )}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Guidelines</CardTitle>
            <CardDescription>
              The backend validates each submitted expense.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Title must be between 3 and 100 characters.</li>
              <li>Amount must be greater than zero.</li>
              <li>New expenses appear in the expenses table after submit.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <p className="text-xs text-destructive">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}
      {field.state.meta.isValidating ? (
        <p className="text-xs text-muted-foreground">Validating...</p>
      ) : null}
    </>
  );
}
