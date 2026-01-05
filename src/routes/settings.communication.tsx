import { createFileRoute, Link } from "@tanstack/solid-router";
import { Index } from "solid-js";
import { Page, Section } from "../comps/layout.tsx";
import { Menu } from "../comps/menu.tsx";
import { getMailingLists, getSubscriber } from "../data.functions/mailing-list.service.ts";

export const Route = createFileRoute("/settings/communication")({
  loader: async () => ({
    lists: (await getMailingLists()).data.results,
    subscriber: (await getSubscriber()),
  }),

  component: () => {
    const data = Route.useLoaderData();

    return (
      <Page>
        <Page.Header>
          <h1 class="flex items-center gap-1">
            <Link to="/settings">
              <i class="i-solar:alt-arrow-left-bold" />
            </Link>
            <span>Communication</span>
          </h1>
        </Page.Header>

        <Section>
          <Section.Header>
            <h2>Mailinglists</h2>
          </Section.Header>

          <Menu>
            <Index each={data().lists}>
              {(list) => (
                <div class="flex">
                  <span>{list().id}</span>
                  <span class="grow">{list().name}</span>
                  <input
                    type="checkbox"
                    checked={data().subscriber.lists.find((p) => p.id === list().id) !== undefined}
                  />
                </div>
              )}
            </Index>
          </Menu>
        </Section>
      </Page>
    );
  },
});
