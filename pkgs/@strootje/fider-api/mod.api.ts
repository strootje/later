import { map, reqres } from "@strootje/more/api";
import { s } from "./models.ts";

export const createFiderClient = map(s.fider, ({ authorization, baseUri }) => {
  const buildApi = (headers: Headers) => {
    return {
      posts: Object.assign((postId: number) => ({
        addTag: reqres(s.posts.addTag, ({ tag }) => {
          return fetch(`${baseUri}/api/v1/posts/${postId}/tags/${tag}`, {
            method: "POST",
            headers,
          });
        }),

        addVote: reqres(s.posts.addVote, () => {
          return fetch(`${baseUri}/api/v1/posts/${postId}/votes`, {
            method: "POST",
            headers,
          });
        }),

        removeVote: reqres(s.posts.removeVote, () => {
          return fetch(`${baseUri}/api/v1/posts/${postId}/votes`, {
            method: "DELETE",
            headers,
          });
        }),
      }), {
        getAll: reqres(s.posts.getAll, ({ query }) => {
          return fetch(`${baseUri}/api/v1/posts?${query}`, {
            headers,
          });
        }),

        new: reqres(s.posts.new, (input) => {
          return fetch(`${baseUri}/api/v1/posts`, {
            body: JSON.stringify(input),
            method: "POST",
            headers,
          });
        }),
      }),

      users: {
        post: reqres(s.users.post, (input) => {
          return fetch(`${baseUri}/api/v1/users`, {
            body: JSON.stringify(input),
            method: "POST",
            headers,
          });
        }),
      },
    };
  };

  return {
    as: (fiderUserId: number) => {
      return buildApi(
        new Headers({
          "content-type": "application/json",
          "X-Fider-UserID": `${fiderUserId}`,
          authorization,
        }),
      );
    },

    ...buildApi(
      new Headers({
        "content-type": "application/json",
        authorization,
      }),
    ),
  };
});
