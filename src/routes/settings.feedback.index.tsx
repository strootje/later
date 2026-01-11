import { useLiveQuery } from "@tanstack/solid-db";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { Index } from "solid-js";
import { AddFeedbackModal } from "../comps.modals/modal.add-feedback.tsx";
import { Page, Section } from "../comps.ui.shell/layout.tsx";
import { Menu } from "../comps.ui.shell/menu.tsx";
import { Icon } from "../comps.ui/icon.tsx";
import { feedbackPostCollection } from "../data.collections/feedback-post.collection.ts";

export const Route = createFileRoute("/settings/feedback/")({
  component: () => {
    const posts = useLiveQuery((p) => {
      return p.from({ post: feedbackPostCollection })
        .orderBy(({ post }) => post.votesCount, "desc");
    });

    const toggleUpvote = (postId: number, hasVoted: boolean) => {
      feedbackPostCollection.update(postId, (draft) => {
        draft.votesCount += hasVoted ? -1 : 1;
        draft.hasVoted = !hasVoted;
      });
    };

    return (
      <Page>
        <Page.Header>
          <h1 class="flex items-center gap-1">
            <Link to="/settings">
              <Icon.Solar class="i-solar:alt-arrow-left-bold" />
            </Link>
            <span>Feedback</span>
          </h1>
        </Page.Header>

        <Section>
          <Menu>
            <Index each={posts.data}>
              {(post) => (
                <article class="flex gap-4">
                  <button
                    type="button"
                    class="rounded px-2 py-1"
                    classList={{
                      "bg-lime-300": post().hasVoted,
                      "bg-stone-300": !post().hasVoted,
                    }}
                    onclick={() => toggleUpvote(post().id, post().hasVoted)}
                  >
                    <span>{post().votesCount}</span>
                  </button>

                  <div>
                    <div>
                      <span>{post().title}</span>
                    </div>

                    <div class="-mt-1 flex gap-2 text-stone-500 text-xs">
                      <span>{post().user.name}</span>
                    </div>
                  </div>
                </article>
              )}
            </Index>
          </Menu>
        </Section>

        <AddFeedbackModal />
      </Page>
    );
  },
});
