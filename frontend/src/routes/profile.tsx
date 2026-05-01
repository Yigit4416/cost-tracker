import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "../lib/api";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error("You are not signed in");
  }
  const data = await res.json();
  return data.user;
}

function ProfilePage() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const displayName = getDisplayName(data);
  const initials = getInitials(displayName ?? data?.email);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:py-10">
      <section className="space-y-2 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase text-muted-foreground">
          Account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Review your signed-in account details and manage the current session.
        </p>
      </section>

      {error ? (
        <Card className="border-destructive/40 bg-destructive/10">
          <CardHeader>
            <CardTitle>Not signed in</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <a href="/api/login">Log in</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/api/register">Create account</a>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {isPending ? (
                <Skeleton className="size-16" />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center bg-muted text-xl font-semibold">
                  {initials}
                </div>
              )}
              <div className="min-w-0 space-y-2">
                <CardTitle className="text-2xl">
                  {isPending ? (
                    <Skeleton className="h-8 w-48" />
                  ) : (
                    displayName ?? "Unnamed user"
                  )}
                </CardTitle>
                <CardDescription>
                  {isPending ? (
                    <Skeleton className="h-4 w-64 max-w-full" />
                  ) : (
                    data?.email ?? "No email available"
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileField
                label="Given name"
                value={data?.given_name}
                isLoading={isPending}
              />
              <ProfileField
                label="Family name"
                value={data?.family_name}
                isLoading={isPending}
              />
              <ProfileField
                label="Email"
                value={data?.email}
                isLoading={isPending}
              />
              <ProfileField
                label="User ID"
                value={data?.id}
                isLoading={isPending}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Session</CardTitle>
              <CardDescription>
                {isPending
                  ? "Checking authentication..."
                  : data
                    ? "Authenticated"
                    : "Unauthenticated"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {data ? (
                <Button variant="outline" asChild>
                  <a href="/api/logout">Log out</a>
                </Button>
              ) : (
                <>
                  <Button asChild>
                    <a href="/api/login">Log in</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/api/register">Create account</a>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Next steps</CardTitle>
              <CardDescription>Continue tracking expenses.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" asChild>
                <Link to="/expenses">View Expenses</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/create-expense">Create Expense</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function ProfileField({
  label,
  value,
  isLoading,
}: {
  label: string;
  value?: string | null;
  isLoading: boolean;
}) {
  return (
    <div className="border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-4 w-32" />
      ) : (
        <p className="mt-2 truncate text-sm font-medium">
          {value || "Not provided"}
        </p>
      )}
    </div>
  );
}

function getInitials(value?: string | null) {
  if (!value) {
    return "--";
  }

  return value
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getDisplayName(
  user?:
    | {
        given_name?: string | null;
        family_name?: string | null;
        email?: string | null;
      }
    | null
) {
  if (!user) {
    return undefined;
  }

  const fullName = [user.given_name, user.family_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || user.email || undefined;
}
