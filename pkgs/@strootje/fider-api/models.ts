import { err, ok } from "neverthrow";
import * as v from "valibot";

const m = {
  response: <TObjectEntries extends v.ObjectEntries>(result: v.ObjectSchema<TObjectEntries, undefined>) =>
    v.pipe(
      v.union([
        result,
        v.object({
          errors: v.array(v.object({ field: v.string(), message: v.string() })),
        }),
      ]),
      v.transform((result) => {
        if ("errors" in result) {
          return err(result.errors);
        }

        return ok(result);
      }),
    ),
};

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

    new: {
      req: v.object({
        title: v.string(),
        description: v.optional(v.string()),
      }),
      res: m.response(v.object({
        id: v.number(),
        number: v.number(),
        title: v.string(),
        slug: v.string(),
      })),
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
