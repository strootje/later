import { clientAuth } from "@scope/better-auth/client";
import { Form } from "@strootje/more/form";
import { createFileRoute } from "@tanstack/solid-router";
import { useAppForm } from "../comps.form/hooks.ts";
import { Page, Section } from "../comps.ui.shell/layout.tsx";
import { getSignupWaitinglistFlag } from "../data.functions/flag.service.ts";

export const Route = createFileRoute("/signup")({
  loader: async () => ({
    signupWaitinglist: await getSignupWaitinglistFlag(),
  }),

  component: () => {
    const loginForm = useAppForm(() => ({
      defaultValues: {
        email: "",
      },

      async onSubmit({ value }) {
        await clientAuth.signIn.magicLink(value);
      },
    }));

    return (
      <Page>
        <Section>
          <Section.Header>
            login
          </Section.Header>

          <Form for={loginForm}>
            <loginForm.AppField name="email">{(field) => <field.TextInput />}</loginForm.AppField>
            <button type="submit">login..</button>
          </Form>
        </Section>
      </Page>
    );
  },
});
