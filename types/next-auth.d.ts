import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's name. */
      name?: string | null;
      /** The user's email. */
      email?: string | null;
      /** Whether the user is an admin. */
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin?: boolean;
  }

  interface JWT {
    email?: string;
    isAdmin?: boolean;
  }
}
