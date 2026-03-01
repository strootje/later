import { findUser } from "#/functions/user.service.ts";
import { createFileRoute, Outlet, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/settings/admin")({
  loader: async () => {
    const { user } = await findUser();
    if (!user || user.role !== "admin") {
      throw redirect({ to: "/signup" });
    }
  },

  component: () => <Outlet />,
});
