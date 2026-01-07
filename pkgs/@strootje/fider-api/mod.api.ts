import { map, reqres } from "@strootje/more/api";
import { s } from "./models.ts";

export const createFiderClient = map(s.fider, ({ authorization, baseUri }) => {
  const buildApi = (headers: Headers) => {
    return {
      posts: Object.assign((postId: number) => ({
        addTag: reqres(s.post.addTag, ({ tag }) => {
          return fetch(`${baseUri}/api/v1/posts/${postId}/tags/${tag}`, {
            method: "POST",
            headers,
          });
        }),

        addVote: reqres(s.post.addVote, () => {
          return fetch(`${baseUri}/api/v1/posts/${postId}/votes`, {
            method: "POST",
            headers,
          });
        }),

        removeVote: reqres(s.post.removeVote, () => {
          return fetch(`${baseUri}/api/v1/posts/${postId}/votes`, {
            method: "DELETE",
            headers,
          });
        }),
      }), {
        create: reqres(s.posts.create, (input) => {
          return fetch(`${baseUri}/api/v1/posts`, {
            body: JSON.stringify(input),
            method: "POST",
            headers,
          });
        }),

        list: reqres(s.posts.list, ({ query }) => {
          return fetch(`${baseUri}/api/v1/posts?${query}`, {
            headers,
          });
        }),
      }),

      users: {
        create: reqres(s.users.create, (input) => {
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
