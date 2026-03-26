import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
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

        if (!user?.passwordHash) return null;
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
