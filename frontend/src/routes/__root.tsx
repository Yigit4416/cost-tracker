import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { userQueryOptions } from "@/lib/api";

interface MyRootContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRootContext>()({
  component: RootLayout,
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData(userQueryOptions);
      return { user, isAuthenticated: true };
    } catch {
      return { user: null, isAuthenticated: false };
    }
  },
});

function RootLayout() {
  const { isAuthenticated } = Route.useRouteContext();

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <Link
            to={isAuthenticated ? "/" : "/about"}
            className="shrink-0 text-sm font-semibold tracking-tight"
          >
            Tracker
          </Link>
          <nav className="-mx-4 flex overflow-x-auto px-4 py-1 sm:mx-0 sm:overflow-visible sm:px-1">
            <div className="flex min-w-max items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Button size="sm" variant="outline" asChild>
                    <Link
                      to="/"
                      activeOptions={{ exact: true }}
                      activeProps={{
                        className:
                          "border-primary/60 bg-primary/15 text-foreground hover:bg-primary/20",
                      }}
                    >
                      Home
                    </Link>
                  </Button>

                  <Button size="sm" variant="outline" asChild>
                    <Link
                      to="/create-expense"
                      activeProps={{
                        className:
                          "border-primary/60 bg-primary/15 text-foreground hover:bg-primary/20",
                      }}
                    >
                      Create Expense
                    </Link>
                  </Button>

                  <Button size="sm" variant="outline" asChild>
                    <Link
                      to="/expenses"
                      activeProps={{
                        className:
                          "border-primary/60 bg-primary/15 text-foreground hover:bg-primary/20",
                      }}
                    >
                      Expenses
                    </Link>
                  </Button>

                  <Button size="sm" variant="outline" asChild>
                    <Link
                      to="/profile"
                      activeProps={{
                        className:
                          "border-primary/60 bg-primary/15 text-foreground hover:bg-primary/20",
                      }}
                    >
                      Profile
                    </Link>
                  </Button>
                </>
              ) : null}

              <Button size="sm" variant="outline" asChild>
                <Link
                  to="/about"
                  activeProps={{
                    className:
                      "border-primary/60 bg-primary/15 text-foreground hover:bg-primary/20",
                  }}
                >
                  About
                </Link>
              </Button>

              {!isAuthenticated ? (
                <>
                  <Button size="sm" asChild>
                    <a href="/api/login">Log in</a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/api/register">Register</a>
                  </Button>
                </>
              ) : null}
            </div>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
