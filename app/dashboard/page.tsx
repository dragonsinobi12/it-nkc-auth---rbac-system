// app/dashboard/page.tsx
// หน้า Dashboard ทั่วไปสำหรับสมาชิกทุกคน (ADMIN, STAFF, USER)
// ตามโจทย์ https://github.com/it-nkc/auth

import { auth, signOut } from "@/app/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role || "USER";

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
            <p className="text-sm text-gray-500">ข้อมูลผู้ใช้งานและสิทธิ์การเข้าถึง</p>
          </div>
          <div className="flex items-center gap-3">
            {role === "ADMIN" && (
              <Link
                href="/admin"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                เข้าสู่ Admin Panel
              </Link>
            )}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                ออกจากระบบ
              </button>
            </form>
          </div>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลโปรไฟล์ของคุณ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
              <span className="text-xs text-gray-500 block">ชื่อ (Name)</span>
              <span className="text-base font-medium text-gray-900">{session.user.name || "ไม่ระบุชื่อ"}</span>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
              <span className="text-xs text-gray-500 block">อีเมล (Email)</span>
              <span className="text-base font-medium text-gray-900">{session.user.email}</span>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
              <span className="text-xs text-gray-500 block">บทบาท (Role)</span>
              <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                role === "ADMIN"
                  ? "bg-red-100 text-red-700"
                  : role === "STAFF"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {role}
              </span>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
              <span className="text-xs text-gray-500 block">รหัสประจำตัว (User ID)</span>
              <span className="text-xs font-mono text-gray-600 break-all">{session.user.id}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
