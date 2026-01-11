import { createListmonkClient } from "@strootje/listmonk-api";
import { createMiddleware, createServerFn, createServerOnlyFn } from "@tanstack/solid-start";
import * as v from "valibot";
import { env } from "./env.service.ts";
import { getUserMiddleware, updateUser } from "./user.service.ts";

const listmonk = createServerOnlyFn(() => {
  return createListmonkClient({
    baseUri: "https://lists.strooware.nl",
    login: env().listmonk.login,
    token: env().listmonk.token,
  });
});

const getSubscriberMiddleware = createMiddleware().middleware([
  getUserMiddleware,
]).server(async ({
  context: { user },
  next,
}) => {
  if (user.subscriberId) {
    return await next({
      context: {
        subscriber: await listmonk().subscribers(user.subscriberId).get({}),
      },
    });
  }

  const subscriber = await listmonk().subscribers.new({
    email: user.email,
    name: user.name,
  });

  await updateUser({
    data: {
      subscriberId: subscriber.id,
    },
  });

  return await next({
    context: { subscriber },
  });
});

export const getSubscriber = createServerFn().middleware([
  getSubscriberMiddleware,
]).handler(({
  context: { subscriber },
}) => {
  return subscriber;
});

export const updateSubscriber = createServerFn().middleware([
  getSubscriberMiddleware,
]).inputValidator(v.object({
  listId: v.number(),
  subscribe: v.boolean(),
})).handler(({
  context: { subscriber },
  data: { listId, subscribe },
}) => {
  return listmonk().subscribers(subscriber.id).update({
    ...subscriber,
    lists: [
      ...subscriber.lists.filter((p) => subscribe || p.id !== listId).map((p) => p.id),
      ...subscribe ? [listId] : [],
    ],
  });
});

export const getMailingLists = createServerFn().handler(async () => {
  const lists = await listmonk().lists.get({
    tags: ["app-later"],
  });

  return lists.results;
});
