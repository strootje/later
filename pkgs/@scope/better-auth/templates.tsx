import { createServerFn } from "@tanstack/solid-start";
import { createTransport } from "nodemailer";
import { renderToStringAsync } from "solid-js/web";

const WelcomeEmailTemplate = () => {
  return <p class="bg-red">this is some JSX email template</p>;
};

const mailer = createTransport({
  host: "127.0.0.1",
  secure: false,
  port: 2525,
});

export const sendWelcomeEmail = createServerFn().handler(async () => {
  await mailer.sendMail({
    from: "no-reply.later@strooware.nl",
    to: "bas+testing@strootje.com",
    subject: "Welcome to the waitinglist",
    html: await renderToStringAsync(WelcomeEmailTemplate),
  });
});
