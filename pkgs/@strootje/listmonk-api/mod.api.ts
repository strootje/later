import { map, reqres } from "@strootje/more/api";
import { s } from "./models.ts";

export const createListmonkClient = map(s.listmonk, ({ authorization, baseUri }) => {
  const headers = {
    "content-type": "application/json",
    authorization,
  };

  return ({
    lists: Object.assign((listId: number) => ({}), {
      get: reqres(s.lists.get, (opts) => {
        return fetch(`${baseUri}/api/lists?${opts.query}`, {
          headers,
        });
      }),
    }),

    subscribers: Object.assign((subscriberId: number) => ({
      get: reqres(s.subscribers.get, (opts) => {
        return fetch(`${baseUri}/api/subscribers/${subscriberId}`, {
          headers,
        });
      }),

      update: reqres(s.subscribers.update, (input) => {
        return fetch(`${baseUri}/api/subscribers/${subscriberId}`, {
          body: JSON.stringify(input),
          method: "PUT",
          headers,
        });
      }),
    }), {
      new: reqres(s.subscribers.new, (body) => {
        return fetch(`${baseUri}/api/subscribers`, {
          body: JSON.stringify(body),
          method: "POST",
          headers,
        });
      }),
    }),
  });
});
