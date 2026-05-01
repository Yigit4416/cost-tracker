import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import { env } from "bun";
import { type Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

if (
  !env.KINDE_CLIENT_ID ||
  !env.KINDE_CLIENT_SECRET ||
  !env.KINDE_REDIRECT_URI ||
  !env.KINDE_LOGOUT_REDIRECT
) {
  throw new Error("KINDE_CLIENT_ID and KINDE_CLIENT_SECRET must be set");
}

// Client for authorization code flow
export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: "https://ojrd.kinde.com",
    clientId: env.KINDE_CLIENT_ID,
    clientSecret: env.KINDE_CLIENT_SECRET,
    redirectURL: env.KINDE_REDIRECT_URI,
    logoutRedirectURL: env.KINDE_LOGOUT_REDIRECT,
  },
);

// Client for client credentials flow
export const kindeApiClient = createKindeServerClient(
  GrantType.CLIENT_CREDENTIALS,
  {
    authDomain: "https://ojrd.kinde.com",
    clientId: env.KINDE_CLIENT_ID,
    clientSecret: env.KINDE_CLIENT_SECRET,
    logoutRedirectURL: env.KINDE_LOGOUT_REDIRECT,
  },
);

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true, // can't accessed with JS
      secure: true, // for ssl
      sameSite: "Lax", // to avoid cross site forgery attacks
    } as const;

    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "refresh_token", "user"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

type Env = {
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);
    if (isAuthenticated) {
      const user = await kindeClient.getUser(manager);
      c.set("user", user);
      await next();
    } else {
      return c.json({ authenticated: false }, 401);
    }
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : String(error) },
      500,
    );
  }
});
