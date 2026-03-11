import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { getGoogleAuthProvider } from "@/lib/auth/google-provider";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const googleProvider = getGoogleAuthProvider();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(parsed.data.password, user.password);

        if (!isValid) {
          return null;
        }

        if (user.role.startsWith("SUSPENDED_")) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.profileImage,
          role: user.role,
        };
      },
    }),
    ...(googleProvider ? [googleProvider] : []),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user.email?.toLowerCase();

      if (!email) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser?.role.startsWith("SUSPENDED_")) {
        return false;
      }

      if (!existingUser) {
        const randomPassword = randomBytes(32).toString("hex");
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        await prisma.user.create({
          data: {
            email,
            name: user.name,
            profileImage: user.image ?? "/profile.png",
            password: hashedPassword,
            role: "USER",
          },
        });
      } else {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: user.name ?? existingUser.name,
            profileImage: user.image ?? existingUser.profileImage,
          },
        });
      }

      return true;
    },
    jwt: async ({ token, user }) => {
      const email = (user?.email ?? token.email)?.toLowerCase();

      if (email) {
        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            role: true,
            profileImage: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.image = dbUser.profileImage;
          return token;
        }
      }

      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
        token.image = user.image ?? null;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "USER";
        session.user.image = (token.image as string | null | undefined) ?? null;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
