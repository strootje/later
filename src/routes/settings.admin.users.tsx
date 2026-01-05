import { useLiveQuery } from "@tanstack/solid-db";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { Index } from "solid-js";
import { Page, Section } from "../comps/layout.tsx";
import { Menu } from "../comps/menu.tsx";
import { UserCard } from "../comps/user-card.tsx";
import { adminUserCollection } from "../data.collections/admin.users.ts";

export const Route = createFileRoute("/settings/admin/users")({
  component: () => {
    const users = useLiveQuery((p) => p.from({ user: adminUserCollection }));

    return (
      <Page>
        <Page.Header>
          <h1 class="flex items-center gap-1">
            <Link to="/settings">
              <i class="i-solar:alt-arrow-left-bold" />
            </Link>
            <span>Users</span>
          </h1>
        </Page.Header>

        <Section>
          <Menu>
            <Index each={users.data}>{(user) => <UserCard user={user()} />}</Index>
          </Menu>
        </Section>
      </Page>
    );
  },
});
