import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:py-10">
      <section className="space-y-2 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase text-muted-foreground">
          About
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Tracker</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A focused expense tracker for recording spending, keeping totals
          current, and reviewing the list without extra noise.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Purpose</CardTitle>
            <CardDescription>Simple spending visibility.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Track expenses by title, amount, and date, then review totals,
            counts, averages, and individual rows from one authenticated
            workspace.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stack</CardTitle>
            <CardDescription>Typed from backend to frontend.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>React with TanStack Router</li>
              <li>TanStack Query caching and mutations</li>
              <li>TanStack Form validation</li>
              <li>Hono RPC API</li>
              <li>shadcn-style UI components</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>Cached and kept in sync.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Expense lists and total spent are cached on the frontend. Creating
            or deleting an expense updates the cache immediately, then refreshes
            from the backend.
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>What you can do</CardTitle>
          <CardDescription>
            The app currently covers the core expense workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Feature
              title="Create"
              text="Add an expense with validation for title, amount, and date."
            />
            <Feature
              title="Review"
              text="Browse every saved expense in a table with live summaries."
            />
            <Feature
              title="Delete"
              text="Remove an expense and update cached totals without waiting."
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-border p-4">
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="mt-2 text-xs text-muted-foreground">{text}</p>
    </div>
  );
}
