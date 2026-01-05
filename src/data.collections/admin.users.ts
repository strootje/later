import { clientAuth } from "@scope/better-auth/client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/solid-db";
import { useQueryClient } from "./query-client.ts";

export const adminUserCollection = createCollection(queryCollectionOptions({
  queryClient: useQueryClient(),
  queryKey: ["server:admin.users"],
  getKey: (item) => item.id,

  queryFn: async () => {
    const { data } = await clientAuth.admin.listUsers({ query: {} });
    return data?.users ?? [];
  },
}));
