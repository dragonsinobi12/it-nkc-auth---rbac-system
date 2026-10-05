// app/admin/page.tsx
// หน้า Admin Dashboard ป้องกันสิทธิ์ด้วย RBAC (Role-Based Access Control)
// ตามโจทย์ https://github.com/it-nkc/auth

import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  // ตรวจสอบว่าล็อกอินแล้วหรือไม่
  if (!session?.user) {
    redirect("/login");
  }

  // ตรวจสอบว่าสิทธิ์เป็น ADMIN หรือไม่
  if ((session.user as any).role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              ADMINISTRATOR AREA
            </span>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">เฉพาะผู้ใช้งานที่มีบทบาท ADMIN เท่านั้น</p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            กลับหน้าแรก
          </Link>
        </div>

        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-6">
          <h2 className="font-semibold text-blue-900">ยินดีต้อนรับ, {session.user.name || session.user.email}</h2>
          <p className="text-sm text-blue-700 mt-1">
            คุณเข้าถึงหน้านี้ได้เนื่องจากบัญชีของคุณมี Role เป็น: <strong>{(session.user as any).role}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-medium text-gray-700">สิทธิ์ทั้งหมด</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">Full Access</p>
            <p className="text-xs text-gray-500 mt-1">เข้าถึงทุกหน้าและจัดการผู้ใช้</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-medium text-gray-700">บทบาทระบบ</h3>
            <p className="text-2xl font-bold text-emerald-600 mt-2">ADMIN, STAFF, USER</p>
            <p className="text-xs text-gray-500 mt-1">3 ระดับสิทธิ์ตามโจทย์ RBAC</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-medium text-gray-700">สถานะเซสชัน</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">Active</p>
            <p className="text-xs text-gray-500 mt-1">JWT Authenticated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
