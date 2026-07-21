import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "todo/server/db";
import { users } from "todo/server/db/schema";
import { eq } from "drizzle-orm";

import { z } from "zod";
import bcrypt from "bcryptjs";

const credentialsSchema = z.object({
  username: z.string().min(5),
  password: z.string().min(9),
});

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User {
    username: string;
  }
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 14 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "username",
          placeholder: "Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        const parsedCreds = credentialsSchema.safeParse(credentials);
        if (!parsedCreds.success) {
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, parsedCreds.data.username))
          .limit(1);

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          parsedCreds.data.password,
          user.password,
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
        };
      },
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        username: token.username,
      },
    }),
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
