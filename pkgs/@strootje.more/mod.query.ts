import { QueryClient } from "@tanstack/query-core";

let queryClient: QueryClient;
export const singleQueryClient = () => {
  return queryClient ??= new QueryClient();
};
