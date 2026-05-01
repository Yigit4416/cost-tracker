import { kindeClient, sessionManager } from "../kinde";
import { Hono } from "hono";
import { getUser } from "../kinde";

const auth = new Hono()
  .get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })
  .get("/callback", async (c) => {
    // will be called every time we login or register
    const url = new URL(c.req.url);
    await kindeClient.handleRedirectToApp(sessionManager(c), url);
    return c.redirect("/");
  })
  .get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
  .get("/me", getUser, async (c) => {
    //@ts-ignore
    const user = c.var.user; // if user is not authenticated it won't even come to here it will return from middleware that is why i used ts-ignore
    if (!user) {
      return c.json({ authenticated: false }, 401);
    }
    return c.json({ authenticated: true, user }, 200);
  });

export default auth;
