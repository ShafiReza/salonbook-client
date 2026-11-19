import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // The Next.js origin. /api/auth/* is rewritten to the Express server (see next.config.mjs).
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false },
        isBlocked: { type: "boolean", required: false },
        phone: { type: "string", required: false },
      },
    }),
  ],
});
