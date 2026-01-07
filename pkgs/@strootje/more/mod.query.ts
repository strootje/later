import { QueryClient } from "@tanstack/solid-query";

let queryClient: QueryClient;
export const singleQueryClient = () => {
  return queryClient ??= new QueryClient();
};
