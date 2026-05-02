import { Button } from "@/components/ui/button";
import {
  api,
  getAllExpenses,
  getExpenses,
  getTotalSpentQueryOptions,
} from "@/lib/api";
import { TrashIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: RouteComponent,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

async function deleteExpense(id: number) {
  const res = await api.expenses[":id"].$delete({
    param: { id: String(id) },
  });

  if (!res.ok) {
    throw new Error("Could not delete expense");
  }

  return res.json();
}

type ExpensesData = Awaited<ReturnType<typeof getExpenses>>;

function RouteComponent() {
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery(getAllExpenses);
  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: async ({ expense }) => {
      queryClient.setQueryData<ExpensesData>(
        getAllExpenses.queryKey,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            expenses: old.expenses.filter((item) => item.id !== expense.id),
          };
        },
      );
      queryClient.setQueryData<number>(
        getTotalSpentQueryOptions.queryKey,
        (old) => (old === undefined ? old : old - expense.amount),
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getAllExpenses.queryKey }),
        queryClient.invalidateQueries({
          queryKey: getTotalSpentQueryOptions.queryKey,
        }),
      ]);
    },
  });

  const expenses = data?.expenses ?? [];
  const totalSpent = expenses.reduce((total, expense) => {
    return total + expense.amount;
  }, 0);

  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:py-10">
      <section className="space-y-2 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase text-muted-foreground">
          Spending
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Expenses</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Review every recorded expense in one place.
        </p>
      </section>

      {error ? (
        <Card className="border-destructive/40 bg-destructive/10">
          <CardHeader>
            <CardTitle>Unable to load expenses</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <section className="grid gap-3 md:grid-cols-3">
        <SummaryCard
          label="Total spent"
          value={currencyFormatter.format(totalSpent)}
          isLoading={isPending}
        />
        <SummaryCard
          label="Expense count"
          value={String(expenses.length)}
          isLoading={isPending}
        />
        <SummaryCard
          label="Average"
          value={currencyFormatter.format(averageExpense)}
          isLoading={isPending}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>All expenses</CardTitle>
          <CardDescription>
            {isPending
              ? "Loading expenses..."
              : `${expenses.length} expense${expenses.length === 1 ? "" : "s"} recorded`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto size-7" />
                    </TableCell>
                  </TableRow>
                ))
              ) : expenses.length > 0 ? (
                expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="text-muted-foreground">
                      #{expense.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {expense.title}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {currencyFormatter.format(expense.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        aria-label={`Delete ${expense.title}`}
                        title={`Delete ${expense.title}`}
                        disabled={
                          deleteExpenseMutation.isPending &&
                          deleteExpenseMutation.variables === expense.id
                        }
                        onClick={() => deleteExpenseMutation.mutate(expense.id)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No expenses recorded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-xs text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
