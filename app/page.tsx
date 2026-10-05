// app/page.tsx
// หน้าแรกของระบบ นำเสนอภาพรวมการทำงาน
// ตามโจทย์ https://github.com/it-nkc/auth

import Link from "next/link";
import { auth } from "@/app/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <div className="font-bold text-lg text-blue-600">
            IT-NKC Auth System
          </div>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <span className="text-sm text-slate-600">
                  สวัสดี, {session.user.name || session.user.email}
                </span>
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6 sm:p-10 space-y-8">
        <section className="text-center py-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Authentication & RBAC Demo
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            ระบบยืนยันตัวตนด้วย Username & Password และ GitHub OAuth พร้อมการกำหนดสิทธิ์ตามบทบาท (Role-Based Access Control)
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow hover:bg-blue-700"
            >
              ทดลองเข้าสู่ระบบ
            </Link>
            <Link
              href="/admin"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-800 shadow-sm hover:bg-slate-50"
            >
              ทดสอบหน้า Admin (RBAC)
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
