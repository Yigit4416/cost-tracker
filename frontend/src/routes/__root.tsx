import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

interface MyRootContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRootContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Link
            to="/"
            className="shrink-0 text-sm font-semibold tracking-tight"
          >
            Tracker
          </Link>
          <nav className="-mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex min-w-max items-center gap-1">
              <Link
                to="/"
                activeOptions={{ exact: true }}
                activeProps={{
                  className: "bg-muted text-foreground",
                }}
                className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Home
              </Link>

              <Link
                to="/create-expense"
                activeProps={{
                  className: "bg-muted text-foreground",
                }}
                className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Create Expense
              </Link>

              <Link
                to="/expenses"
                activeProps={{
                  className: "bg-muted text-foreground",
                }}
                className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Expenses
              </Link>

              <Link
                to="/profile"
                activeProps={{
                  className: "bg-muted text-foreground",
                }}
                className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Profile
              </Link>

              <Link
                to="/about"
                activeProps={{
                  className: "bg-muted text-foreground",
                }}
                className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                About
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
