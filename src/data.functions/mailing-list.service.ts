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
    const subcriberResult = await listmonk().subscribers(user.subscriberId).get({});

    if (!subcriberResult.isOk()) {
      throw subcriberResult.error;
    }

    return await next({
      context: {
        subscriber: subcriberResult.value,
      },
    });
  }

  const foundSubscribersResult = await listmonk().subscribers.find({
    query: `subscribers.email = '${user.email}'`,
  });

  const foundSubscribers = foundSubscribersResult.isOk() ? foundSubscribersResult.value.results : [];
  const subscriber = foundSubscribers[0] ?? await (async () => {
    const newSubscriberResult = await listmonk().subscribers.new({
      email: user.email,
      name: user.name,
    });

    if (!newSubscriberResult.isOk()) {
      throw newSubscriberResult.error;
    }

    return newSubscriberResult.value;
  })();

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
})).handler(async ({
  context: { subscriber },
  data: { listId, subscribe },
}) => {
  const subscriberResult = await listmonk().subscribers(subscriber.id).update({
    ...subscriber,
    lists: [
      ...subscriber.lists.filter((p) => subscribe || p.id !== listId).map((p) => p.id),
      ...subscribe ? [listId] : [],
    ],
  });

  if (!subscriberResult.isOk()) {
    throw subscriberResult.error;
  }

  return subscriberResult.value;
});

export const getMailingLists = createServerFn().handler(async () => {
  const listsResult = await listmonk().lists.get({
    tags: ["app-later"],
  });

  if (!listsResult.isOk()) {
    throw listsResult.error;
  }

  return listsResult.value.results;
});
