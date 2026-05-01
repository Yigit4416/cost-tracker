import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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

export const Route = createFileRoute("/expenses")({
  component: RouteComponent,
});

async function getExpenses() {
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error("Could not load expenses");
  }
  const data = await res.json();
  return data;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function RouteComponent() {
  const { isPending, error, data } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  const expenses = data?.expenses ?? [];
  const totalSpent = expenses.reduce((total, expense) => {
    return total + expense.amount;
  }, 0);

  const averageExpense =
    expenses.length > 0 ? totalSpent / expenses.length : 0;

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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
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
