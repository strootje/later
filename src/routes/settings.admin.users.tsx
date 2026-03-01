import { UserCard } from "#/components/card-user.tsx";
import { Icon } from "#/components/common-icon.tsx";
import { Page, Section } from "#/components/shell-app-layout.tsx";
import { Menu } from "#/components/shell-app-menu.tsx";
import { UserCollection } from "#/functions/user.collection.ts";
import { useLiveQuery } from "@tanstack/solid-db";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { Index } from "solid-js";

export const Route = createFileRoute("/settings/admin/users")({
  component: () => {
    const users = useLiveQuery((query) => {
      return query.from({ user: UserCollection });
    });

    return (
      <Page>
        <Page.Header>
          <h1 class="flex items-center gap-1">
            <Link to="/settings">
              <Icon.Solar class="i-solar:alt-arrow-left-bold" />
            </Link>
            <span>Users</span>
          </h1>
        </Page.Header>

        <Section>
          <Menu>
            <Index each={users()}>{(user) => <UserCard user={user()} />}</Index>
          </Menu>
        </Section>
      </Page>
    );
  },
});
