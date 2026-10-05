// src/pages/CodeViewerPage.tsx
import React, { useState } from "react";
import { PageRoute } from "../types";
import { Code2, Copy, Check, FileCode, CheckCircle2 } from "lucide-react";

interface CodeViewerPageProps {
  navigate: (route: PageRoute) => void;
}

interface CodeFile {
  name: string;
  path: string;
  category: string;
  content: string;
}

const FILES: CodeFile[] = [
  {
    name: "schema.prisma",
    path: "prisma/schema.prisma",
    category: "Prisma Database",
    content: `// prisma/schema.prisma
// โมเดล User และ Enum Role ตามโจทย์ it-nkc/auth

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // หรือ postgresql
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  name         String?
  email        String   @unique
  passwordHash String
  role         Role     @default(USER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum Role {
  ADMIN
  STAFF
  USER
}`,
  },
  {
    name: "auth.ts",
    path: "app/auth.ts",
    category: "NextAuth v5 Config",
    content: `// app/auth.ts
// กำหนด Credentials, GitHub Provider, JWT และ Session Callbacks

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // 1. Login ด้วย Email / Password
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        const passwordValid = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // 2. Login ด้วย GitHub
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        // Credentials มี role จาก User
        if (user.role) {
          token.role = user.role;
        }

        // GitHub user ไม่มี role จาก Credentials ให้ USER เป็นค่าเริ่มต้น
        if (!token.role) {
          token.role = "USER";
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "USER";
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
});`,
  },
  {
    name: "actions.ts (Signup)",
    path: "app/signup/actions.ts",
    category: "Server Actions",
    content: `// app/signup/actions.ts
"use server";

import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export type SignUpState = {
  error?: string;
  success?: boolean;
};

export async function signUp(
  prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  // ตรวจสอบความครบถ้วน
  if (!name || !email || !password || !confirmPassword) {
    return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  // ตรวจสอบความยาวรหัสผ่าน
  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" };
  }

  // ตรวจสอบรหัสผ่านตรงกัน
  if (password !== confirmPassword) {
    return { error: "รหัสผ่านไม่ตรงกัน" };
  }

  // ตรวจสอบรูปแบบอีเมล
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "รูปแบบ Email ไม่ถูกต้อง" };
  }

  // ตรวจสอบอีเมลซ้ำ
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return { error: "Email นี้ถูกใช้งานแล้ว" };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // สร้าง User ใหม่
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "USER",
    },
  });

  return { success: true };
}`,
  },
  {
    name: "admin/page.tsx",
    path: "app/admin/page.tsx",
    category: "RBAC Protected Route",
    content: `// app/admin/page.tsx
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  // 1. ตรวจสอบว่าล็อกอินหรือไม่
  if (!session?.user) {
    redirect("/login");
  }

  // 2. ตรวจสอบว่าเป็น ADMIN หรือไม่
  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>เฉพาะ ADMIN เท่านั้น</p>
    </div>
  );
}`,
  },
  {
    name: "unauthorized/page.tsx",
    path: "app/unauthorized/page.tsx",
    category: "Error Page",
    content: `// app/unauthorized/page.tsx
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">🚫</div>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          ไม่มีสิทธิ์เข้าถึง
        </h1>
        <p className="mb-6 text-gray-600">
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้
          กรุณาติดต่อผู้ดูแลระบบหากคิดว่าคุณควรมีสิทธิ์เข้าถึง
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
          >
            กลับ Dashboard
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-100"
          >
            หน้าแรก
          </Link>
        </div>
      </div>
    </main>
  );
}`,
  },
  {
    name: ".env.example",
    path: ".env.example",
    category: "Config",
    content: `# NextAuth Secret
AUTH_SECRET="your-auth-secret-string"

# GitHub OAuth App
AUTH_GITHUB_ID="your_github_client_id"
AUTH_GITHUB_SECRET="your_github_client_secret"

# Database Connection
DATABASE_URL="file:./dev.db"`,
  },
];

export const CodeViewerPage: React.FC<CodeViewerPageProps> = ({ navigate }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile = FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            <FileCode className="w-3.5 h-3.5" />
            SOURCE CODE INSPECTOR
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            โค้ดไฟล์ที่สร้างตามโจทย์ it-nkc/auth
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ทุกไฟล์ถูกบันทึกไว้ในโครงสร้างโปรเจกต์พร้อมสำหรับ Push ขึ้น GitHub ด้วย GitHub Desktop
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>คัดลอกไฟล์แล้ว!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>คัดลอกโค้ดไฟล์นี้</span>
            </>
          )}
        </button>
      </div>

      {/* File Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {FILES.map((f, idx) => (
          <button
            key={f.path}
            onClick={() => setSelectedFileIndex(idx)}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedFileIndex === idx
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Code Display Container */}
      <div className="rounded-2xl bg-slate-950 text-slate-200 shadow-xl overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="font-mono text-slate-400 ml-2">{currentFile.path}</span>
          </div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider">
            {currentFile.category}
          </span>
        </div>

        <pre className="p-5 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed text-slate-300">
          <code>{currentFile.content}</code>
        </pre>
      </div>
    </div>
  );
};
