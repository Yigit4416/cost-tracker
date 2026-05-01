import { hc } from "hono/client";
import type { ApiRoute } from "@server/app";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoute>("/api");

export const api = client;

async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error("You are not signed in");
  }
  const data = await res.json();
  return data.user;
}

// With this users log things will be saved forever untill we invalidate them.
// // When you need user data you don't have to make the same request over and over again
export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});
