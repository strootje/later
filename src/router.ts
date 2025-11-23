import { createRouter } from "@tanstack/solid-router";
import { routeTree } from "./route-tree.gen.ts";

export const getRouter = () => {
  return createRouter({
    scrollRestoration: true,
    routeTree,
  });
};
