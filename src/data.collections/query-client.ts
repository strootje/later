import { QueryClient } from "@tanstack/solid-query";

let queryClient: QueryClient;
export const useQueryClient = () => {
  return queryClient ??= new QueryClient();
};
