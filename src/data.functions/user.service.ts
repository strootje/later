import { serverAuth } from "@scope/better-auth/server";
import { createMiddleware, createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";

export const findUserMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await serverAuth.api.getSession({ headers: getRequestHeaders() });

  return await next({
    context: {
      user: session?.user,
    },
  });
});

export const getUserMiddleware = createMiddleware().middleware([
  findUserMiddleware,
]).server(async ({ context: { user }, next }) => {
  if (!user) {
    throw "no user found..";
  }

  return await next({
    context: {
      user,
    },
  });
});

export const findUser = createServerFn().middleware([
  findUserMiddleware,
]).handler(({ context: { user } }) => {
  return Promise.resolve({ user });
});
