import { createFileRoute, Outlet, redirect } from "@tanstack/solid-router";
import { findUser } from "../data.functions/user.service.ts";

export const Route = createFileRoute("/settings/admin")({
  loader: async () => {
    const { user } = await findUser();
    if (!user || user.role !== "admin") {
      throw redirect({ to: "/signup" });
    }
  },

  component: () => <Outlet />,
});
