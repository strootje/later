import { createServerFn } from "@tanstack/solid-start";
import { getUserMiddleware, updateUser } from "./user.service.ts";

type Subscriber = {
  id: number;
  created_at: string;
  updated_at: string;
  uuid: string;
  email: string;
  name: string;
  attribs: Record<string, any>;
  status: string;
  lists: Array<{
    subscription_status: string;
    id: number;
    uuid: string;
    name: string;
    type: string;
    tags: Array<string>;
    created_at: string;
    updated_at: string;
  }>;
};

export const getSubscriber = createServerFn().middleware([
  getUserMiddleware,
]).handler(async ({
  context: { user },
}) => {
  let resp: Response;
  if (user.subscriberId) {
    resp = await fetch(`https://lists.strooware.nl/api/subscribers/${user.subscriberId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "authorization": `token ${"later:oIuz1XoK5G6Uj1n93efZGR5oaNw2TV4v"}`,
      },
    });
  } else {
    resp = await fetch(`https://lists.strooware.nl/api/subscribers`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `token ${"later:oIuz1XoK5G6Uj1n93efZGR5oaNw2TV4v"}`,
      },
      body: JSON.stringify({
        email: user.email,
        status: "enabled",
        name: user.name,
      }),
    });
  }

  if (!resp.ok) {
    throw "error..";
  }

  const subscriber = await resp.json() as {
    data: Subscriber;
  };

  await updateUser({
    data: {
      subscriberId: subscriber.data.id,
    },
  });

  return subscriber.data;
});

// export const updateSubscriber = createServerFn().;

export const getMailingLists = createServerFn().handler(async () => {
  const query = new URLSearchParams({
    tag: "app-later",
  });

  const resp = await fetch(`https://lists.strooware.nl/api/lists?${query.toString()}`, {
    headers: {
      "content-type": "application/json",
      "authorization": `token ${"later:oIuz1XoK5G6Uj1n93efZGR5oaNw2TV4v"}`,
    },
  });

  return await resp.json() as {
    data: {
      results: Array<{
        id: number;
        created_at: string;
        updated_at: string;
        uuid: string;
        name: string;
        type: string;
        optin: string;
        tags: string[];
        subscriber_count: number;
        description: string;
      }>;
      total: number;
      per_page: number;
      page: number;
    };
  };
});
