import { clientAuth } from "@scope/auth/client";
import { singleQueryClient } from "@strootje/more/query";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/solid-db";
import { createClientOnlyFn } from "@tanstack/solid-start";

const listUsers = createClientOnlyFn(() => {
  return clientAuth.admin.listUsers({ query: {} });
});

export const UserCollection = createCollection(queryCollectionOptions({
  queryClient: singleQueryClient(),
  queryKey: ["server:admin.users"],
  getKey: (item) => item.id,

  queryFn: async () => {
    const { data } = await listUsers();
    return data?.users ?? [];
  },
}));
