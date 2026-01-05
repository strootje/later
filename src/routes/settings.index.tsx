import { clientAuth } from "@scope/better-auth/client";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { Show } from "solid-js";
import { Page, Section } from "../comps/layout.tsx";
import { findUser } from "../data.functions/user.service.ts";

export const Route = createFileRoute("/settings/")({
  loader: async () => ({
    user: (await findUser()).user,
  }),

  component: () => {
    const data = Route.useLoaderData();

    return (
      <Page>
        <Page.Header>
          <h1 class="text-2xl">Settings</h1>
        </Page.Header>

        <Section class="rounded-xl bg-stone-300 p-4">
          <Show when={data().user} fallback={<Link to="/signup">Sign in</Link>}>
            {(user) => (
              <>
                <Section.Header>
                  {user().email}
                </Section.Header>

                <Link to="/settings/feedback">Feedback</Link>
                <button
                  type="button"
                  onclick={() => clientAuth.signOut()}
                >
                  Sign out
                </button>
              </>
            )}
          </Show>
        </Section>

        <Show when={data().user?.role === "admin"}>
          <Section class="ring-1">
            <Section.Header>
              <h2>Admin Functions</h2>
            </Section.Header>

            <Link to="/settings/admin/users">Users</Link>
          </Section>
        </Show>
      </Page>
    );
  },
});
