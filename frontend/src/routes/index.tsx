import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { getTotalSpentQueryOptions } from "../lib/api";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const { isPending, error, data } = useQuery(getTotalSpentQueryOptions);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl justify-center px-4 pt-10 md:pt-14">
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Total Spent</CardTitle>
          <CardDescription className="text-muted-foreground">
            The total amount you spent...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-4xl font-semibold tracking-tight">
          {isPending || data === undefined ? "..." : "$" + data}
        </CardContent>
      </Card>
    </main>
  );
}
