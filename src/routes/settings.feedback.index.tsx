import { Dialog } from "@ark-ui/solid/dialog";
import { Form } from "@strootje/more/form";
import { useLiveQuery } from "@tanstack/solid-db";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { Index } from "solid-js";
import { Portal } from "solid-js/web";
import { useAppForm } from "../comps/form/hooks.ts";
import { Page, Section } from "../comps/layout.tsx";
import { Menu } from "../comps/menu.tsx";
import { feedbackPostCollection } from "../data.collections/feedback.ts";
import { addFeedbackPost } from "../data.functions/feedback.service.ts";

export const Route = createFileRoute("/settings/feedback/")({
  component: () => {
    const posts = useLiveQuery((p) => {
      return p.from({ post: feedbackPostCollection })
        .orderBy(({ post }) => post.votesCount, "desc");
    });

    const addFeedbackForm = useAppForm(() => ({
      defaultValues: {
        title: "",
      },

      async onSubmit({ value }) {
        await addFeedbackPost({
          data: { title: value.title },
        });

        feedbackPostCollection.utils.refetch();
      },
    }));

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
              <i class="i-solar:alt-arrow-left-bold" />
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

        <Dialog.Root>
          <Dialog.Trigger>NEW FEEDBACK</Dialog.Trigger>

          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner class="position-absolute bg-stone-300">
              <Dialog.Content>
                <Dialog.Title>FEEDBACK..</Dialog.Title>

                <Form handler={addFeedbackForm}>
                  <addFeedbackForm.AppField name="title">{(field) => <field.TextInput />}</addFeedbackForm.AppField>
                  <button type="submit">toevoegen</button>
                </Form>

                <Dialog.CloseTrigger class="bg-red">
                  CLOSE
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Page>
    );
  },
});
