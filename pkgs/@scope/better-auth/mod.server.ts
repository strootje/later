import { passkey } from "@better-auth/passkey";
import { useDatabaseForBetterAuth } from "@scope/database/server";
import { betterAuth } from "better-auth";
import { admin, magicLink } from "better-auth/plugins";

export const serverAuth = betterAuth({
  database: useDatabaseForBetterAuth(),

  emailAndPassword: {
    enabled: false,
  },

  plugins: [
    admin(),
    magicLink({
      sendMagicLink({ email, token, url }) {
        // await sendWelcomeEmail();
        console.log("sendMagicLink", email, token, url);
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
