import { clientAuth } from "@scope/better-auth/client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { useQueryClient } from "@tanstack/solid-query";

export const createAdminUsersCollectionOptions = () => {
  return queryCollectionOptions({
    queryClient: useQueryClient(),
    queryKey: ["server:admin.users"],
    getKey: (item) => item.id,

    queryFn: async () => {
      const { data } = await clientAuth.admin.listUsers({ query: {} });
      return data?.users ?? [];
    },
  });
};
