import { Dialog, DialogOpenChangeDetails } from "@ark-ui/solid/dialog";
import { Form } from "@strootje/more/form";
import { animate } from "motion";
import { type ParentProps } from "solid-js";
import { Portal } from "solid-js/web";
import { useAppForm } from "../comps.form/hooks.ts";
import { feedbackPostCollection } from "../data.collections/feedback-post.collection.ts";
import { addFeedbackPost } from "../data.functions/feedback.service.ts";

export const AddFeedbackModal = (props: ParentProps) => {
  let ref: HTMLDivElement | undefined;

  const handleOpenChanged = ({ open }: DialogOpenChangeDetails) => {
    if (!ref) {
      return;
    }
    animate(ref, {
      translateY: open ? 0 : "100%",
    });
  };

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

  return (
    <Dialog.Root onOpenChange={handleOpenChanged}>
      <Dialog.Trigger>
        {props.children ?? <span>NEW FEEDBACK!</span>}
      </Dialog.Trigger>

      <Portal>
        <Dialog.Positioner>
          <Dialog.Content
            ref={(el) => (ref = el)}
            style={{
              transform: "translateY(100%)",
            }}
            class="fixed inset-[auto_10px_10px] rounded-xl bg-white px-4 py-3 shadow-[2px_2px_0_2px] ring-2"
          >
            <Dialog.Title>FEEDBACK..</Dialog.Title>

            <Form for={addFeedbackForm}>
              <addFeedbackForm.AppField name="title">{(field) => <field.TextInput />}</addFeedbackForm.AppField>
              <button type="submit">submit</button>
            </Form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
