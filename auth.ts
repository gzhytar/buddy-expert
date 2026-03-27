import NextAuth, { CredentialsSignin } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import authConfig from "./auth.config";
import { db } from "@/lib/db";
import {
  accounts,
  authSessions,
  authenticators,
  users,
  verificationTokens,
} from "@/lib/db/schema";

/**
 * Stejný e-mail u Google a u účtu s heslem: Auth.js propojí účty, pokud Google
 * e-mail označí jako ověřený (`allowDangerousEmailAccountLinking`). Interní JIC app.
 */
const googleProvider =
  process.env.GOOGLE_CLIENT_ID?.trim() &&
  process.env.GOOGLE_CLIENT_SECRET?.trim()
    ? Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    : null;

class OAuthOnlyCredentialsError extends CredentialsSignin {
  code = "oauth_only";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: authSessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  trustHost: true,
  providers: [
    ...(googleProvider ? [googleProvider] : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Heslo", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password || typeof email !== "string") return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email.trim().toLowerCase()))
          .limit(1);

        if (!user) return null;
        if (!user.passwordHash) {
          throw new OAuthOnlyCredentialsError();
        }
        const ok = await bcrypt.compare(String(password), user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
});
