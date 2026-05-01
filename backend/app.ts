import { Hono } from "hono";
import { logger } from "hono/logger";
import expenses from "./routes/expenses";

import { serveStatic } from "hono/bun";
import auth from "./routes/auth";

const app = new Hono();

app.use("*", logger());

app.get("/test", (c) => {
  return c.json({ message: "Hono!" });
});

const apiRoutes = new Hono().route("/expenses", expenses).route("/", auth);
app.route("/api", apiRoutes);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoute = typeof apiRoutes;
