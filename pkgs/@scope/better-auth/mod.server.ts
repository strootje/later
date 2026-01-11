import { passkey } from "@better-auth/passkey";
import { useDatabaseForBetterAuth } from "@scope/database/server";
import { betterAuth } from "better-auth";
import { admin, magicLink } from "better-auth/plugins";
import { sendWelcomeEmail } from "./templates.tsx";

export const serverAuth = betterAuth({
  database: useDatabaseForBetterAuth(),

  emailAndPassword: {
    enabled: false,
  },

  plugins: [
    admin(),
    magicLink({
      async sendMagicLink({ email, url }) {
        await sendWelcomeEmail({ data: { email, templateData: { url } } });
      },
    }),
    passkey(),
  ],

  user: {
    additionalFields: {
      subscriberId: {
        type: "number",
        required: false,
      },
    },
  },
});
