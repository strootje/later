import * as v from "valibot";

const m = {
  response: <TEntries extends v.ObjectEntries>(data: v.ObjectSchema<TEntries, undefined>) => {
    return v.pipe(
      v.object({ data }),
      v.transform(({ data }) => data),
    );
  },

  paged: <TEntries extends v.ObjectEntries>(result: v.ObjectSchema<TEntries, undefined>) => {
    return v.object({
      results: v.array(result),
      per_page: v.number(),
      total: v.number(),
      page: v.number(),
    });
  },
};

const subscriberStatus = v.union([
  v.literal("enabled"),
  v.literal("blocklisted"),
]);

const list = v.object({
  id: v.number(),
  created_at: v.string(),
  updated_at: v.string(),
  uuid: v.string(),
  name: v.string(),
  type: v.string(),
  optin: v.string(),
  tags: v.array(v.string()),
  subscriber_count: v.optional(v.number()),
  description: v.string(),
});

const subscriber = v.object({
  id: v.number(),
  created_at: v.string(),
  updated_at: v.string(),
  uuid: v.string(),
  email: v.string(),
  name: v.string(),
  attribs: v.record(v.string(), v.any()),
  status: subscriberStatus,
  lists: v.array(list),
});

const newSubscriber = v.object({
  attribs: v.optional(v.record(v.string(), v.any())),
  preconfirm_subscriptions: v.optional(v.boolean()),
  status: v.optional(subscriberStatus, "enabled"),
  list_uuids: v.optional(v.array(v.string())),
  lists: v.optional(v.array(v.number())),
  email: v.string(),
  name: v.string(),
});

export const s = {
  listmonk: v.pipe(
    v.object({
      baseUri: v.string(),
      login: v.string(),
      token: v.string(),
    }),
    v.transform(({
      baseUri,
      login,
      token,
    }) => ({
      authorization: `token ${login}:${token}`,
      baseUri,
    })),
  ),

  lists: {
    get: {
      req: v.pipe(
        v.object({
          tags: v.array(v.string()),
        }),
        v.transform((input) => ({
          query: new URLSearchParams({
            tag: input.tags.join(","),
          }).toString(),
        })),
      ),
      res: m.response(m.paged(list)),
    },
  },

  subscribers: {
    find: {
      req: v.pipe(
        v.object({
          query: v.string(),
        }),
        v.transform(({ query }) => ({
          query: new URLSearchParams({ query }).toString(),
        })),
      ),
      res: m.response(m.paged(subscriber)),
    },

    get: {
      req: v.object({}),
      res: m.response(subscriber),
    },

    new: {
      req: newSubscriber,
      res: m.response(subscriber),
    },

    update: {
      req: newSubscriber,
      res: m.response(subscriber),
    },
  },
};
