import { createServerFn } from "@tanstack/solid-start";
import { createTransport } from "nodemailer";
import { renderToStringAsync } from "solid-js/web";
import * as v from "valibot";
import { env } from "../../../src/data.functions/env.service.ts";

const WelcomeEmailTemplate = (props: { url: string }) => {
  return (
    <>
      <h1>Welcome to doetlater</h1>
      <a href={props.url} target="_blank">{props.url}</a>
    </>
  );
};

const mailer = (opts: ReturnType<typeof env>["smtp"]) => {
  return createTransport({
    host: opts.host,
    port: opts.port,
    secure: false,
  });
};

export const sendWelcomeEmail = createServerFn().inputValidator(v.object({
  templateData: v.object({ url: v.string() }),
  email: v.string(),
})).handler(async ({ data }) => {
  const html = await renderToStringAsync(() => <WelcomeEmailTemplate {...data.templateData} />);

  if (!env().smtp.host) {
    console.log("***NO SMTP HOST***");
    console.log(html);
  } else {
    await mailer(env().smtp).sendMail({
      from: "no-reply.later@strooware.nl",
      subject: "Welcome to the waitinglist",
      to: data.email,
      html,
    });
  }
});
