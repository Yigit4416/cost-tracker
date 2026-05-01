import { hc } from "hono/client";
import type { ApiRoute } from "@server/app";

const client = hc<ApiRoute>("/api");

export const api = client;
