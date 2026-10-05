// app/auth.ts
// ระบบยืนยันตัวตน NextAuth v5 (Auth.js) พร้อม Credentials และ GitHub Provider
// ตามโจทย์ https://github.com/it-nkc/auth

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ==========================================
    // Login ด้วย Email / Password
    // ==========================================
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordValid = await bcrypt.compare(
          password,
          user.passwordHash,
        );

        if (!passwordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // ==========================================
    // Login ด้วย GitHub
    // ==========================================
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],

  callbacks: {
    // ==========================================
    // JWT Callback
    // ==========================================
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        // Credentials มี role จากฐานข้อมูล
        if ((user as any).role) {
          token.role = (user as any).role;
        }

        // GitHub user ไม่มี role จาก Credentials ให้ USER เป็นค่าเริ่มต้น
        if (!token.role) {
          token.role = "USER";
        }
      }

      return token;
    },

    // ==========================================
    // Session Callback
    // ==========================================
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = (token.role as string) || "USER";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
});
