import { clientAuth } from "@scope/better-auth/client";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { Show } from "solid-js";
import { UserCard } from "../comps.ui.cards/user.card.tsx";
import { Page, Section } from "../comps.ui.shell/layout.tsx";
import { Menu } from "../comps.ui.shell/menu.tsx";
import { Icon } from "../comps.ui/icon.tsx";
import { findUser } from "../data.functions/user.service.ts";

export const Route = createFileRoute("/settings/")({
  loader: async () => ({
    user: (await findUser()).user,
  }),

  component: () => {
    const data = Route.useLoaderData();

    const handleLogout = async () => {
      await clientAuth.signOut();
    };

    return (
      <Page>
        <Page.Header>
          <span>Settings</span>
        </Page.Header>

        <Section>
          <Show when={data().user} fallback={<Link to="/signup">Sign in</Link>}>
            {(user) => (
              <>
                <Menu>
                  <UserCard user={user()} />

                  <Link to="/settings/communication">
                    <Icon.Solar class="i-solar:mailbox-bold-duotone" />
                    <span class="grow">Communication</span>
                    <Icon.Solar class="i-solar:alt-arrow-right-bold-duotone" />
                  </Link>

                  <Link to="/settings/feedback">
                    <Icon.Solar class="i-solar:phone-calling-rounded-bold-duotone" />
                    <span class="grow">Feedback</span>
                    <Icon.Solar class="i-solar:alt-arrow-right-bold-duotone" />
                  </Link>

                  <button type="button" onclick={handleLogout}>
                    <Icon.Solar class="i-solar:logout-2-bold-duotone" />
                    <span>Logout</span>
                  </button>
                </Menu>
              </>
            )}
          </Show>
        </Section>

        <Show when={data().user?.role === "admin"}>
          <Section>
            <Section.Header>
              <h2>Admin</h2>
            </Section.Header>

            <Menu>
              <Link to="/settings/admin/users">
                <Icon.Solar class="i-solar:users-group-rounded-bold-duotone" />
                <span class="grow">Users</span>
                <Icon.Solar class="i-solar:alt-arrow-right-bold-duotone" />
              </Link>
            </Menu>
          </Section>
        </Show>
      </Page>
    );
  },
});
