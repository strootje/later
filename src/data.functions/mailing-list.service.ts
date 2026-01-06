import { createListmonkClient } from "@strootje/listmonk-api";
import { createServerFn } from "@tanstack/solid-start";
import { getUserMiddleware, updateUser } from "./user.service.ts";

const listmonk = createListmonkClient({
  baseUri: "https://lists.strooware.nl",
  token: "oIuz1XoK5G6Uj1n93efZGR5oaNw2TV4v",
  login: "later",
});

export const getSubscriber = createServerFn().middleware([
  getUserMiddleware,
]).handler(async ({
  context: { user },
}) => {
  if (user.subscriberId) {
    return await listmonk.subscribers(user.subscriberId).get({});
  }

  const subscriber = await listmonk.subscribers.post({
    email: user.email,
    name: user.name,
  });

  await updateUser({
    data: {
      subscriberId: subscriber.id,
    },
  });

  return subscriber;
});

// export const updateSubscriber = createServerFn().;

export const getMailingLists = createServerFn().handler(async () => {
  const lists = await listmonk.lists.get({
    tags: ["app-later"],
  });

  return lists.results;
});
