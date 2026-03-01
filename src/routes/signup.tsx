import { useAppForm } from "#/components/hooks-form.ts";
import { Page, Section } from "#/components/shell-app-layout.tsx";
import { getSignupWaitinglistFlag } from "#/functions/flag.service.ts";
import { clientAuth } from "@scope/auth/client";
import { Form } from "@strootje/more/form";
import { createFileRoute } from "@tanstack/solid-router";
import { createClientOnlyFn } from "@tanstack/solid-start";

export const Route = createFileRoute("/signup")({
  loader: async () => ({
    signupWaitinglist: await getSignupWaitinglistFlag(),
  }),

  component: () => {
    const loginForm = useAppForm(() => ({
      defaultValues: {
        email: "",
      },

      onSubmit: createClientOnlyFn(async ({ value }) => {
        await clientAuth.signIn.magicLink(value);
      }),
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
