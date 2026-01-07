import { clientAuth } from "@scope/better-auth/client";
import { singleQueryClient } from "@strootje/more/query";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/solid-db";

export const userCollection = createCollection(queryCollectionOptions({
  queryClient: singleQueryClient(),
  queryKey: ["server:admin.users"],
  getKey: (item) => item.id,

  queryFn: async () => {
    const { data } = await clientAuth.admin.listUsers({ query: {} });
    return data?.users ?? [];
  },
}));
