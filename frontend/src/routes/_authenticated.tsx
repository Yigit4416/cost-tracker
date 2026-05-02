import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

/*
  We created a folder called /_authenticated and if a file is in that folder than first this file will be executed and that the page will be rendered
*/

const Component = () => {
  return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
  component: Component,
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData(userQueryOptions);
      return { user };
    } catch {
      throw redirect({
        to: "/about",
      });
    }
  },
});
