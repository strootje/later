import * as v from "valibot";

const post = v.object({
  id: v.number(),
  number: v.number(),
  title: v.string(),
  hasVoted: v.boolean(),
  votesCount: v.number(),
  user: v.object({
    id: v.number(),
    name: v.string(),
    role: v.string(),
  }),
});

const user = v.object({
  id: v.number(),
});

export const s = {
  fider: v.pipe(
    v.object({
      baseUri: v.string(),
      token: v.string(),
    }),
    v.transform(({
      baseUri,
      token,
    }) => ({
      authorization: `Bearer ${token}`,
      baseUri,
    })),
  ),

  posts: {
    getAll: {
      req: v.pipe(
        v.object({
          tags: v.optional(v.array(v.string()), []),
        }),
        v.transform(({ tags }) => ({
          query: new URLSearchParams({
            tags: tags.join(","),
          }).toString(),
        })),
      ),
      res: v.array(post),
    },

    new: {
      req: v.object({
        title: v.string(),
      }),
      res: post,
    },

    addTag: {
      req: v.object({
        tag: v.string(),
      }),
      res: v.object({}),
    },

    addVote: {
      req: v.object({}),
      res: v.object({}),
    },

    removeVote: {
      req: v.object({}),
      res: v.object({}),
    },
  },

  users: {
    post: {
      req: v.object({
        reference: v.string(),
        email: v.string(),
        name: v.string(),
      }),
      res: user,
    },
  },
};
