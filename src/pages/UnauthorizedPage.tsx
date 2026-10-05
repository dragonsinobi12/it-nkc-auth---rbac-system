// src/pages/UnauthorizedPage.tsx
import React from "react";
import { PageRoute } from "../types";
import { ShieldX, AlertTriangle, ArrowLeft, Home } from "lucide-react";

interface UnauthorizedPageProps {
  navigate: (route: PageRoute) => void;
}

export default function UnauthorizedPage({ navigate }: UnauthorizedPageProps) {
  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl border border-gray-200">
        <div className="mb-4 text-6xl select-none animate-bounce">🚫</div>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          ไม่มีสิทธิ์เข้าถึง
        </h1>
        <p className="mb-6 text-gray-600 leading-relaxed text-sm">
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้
          กรุณาติดต่อผู้ดูแลระบบหากคิดว่าคุณควรมีสิทธิ์เข้าถึง
        </p>

        {/* Explain RBAC Reason */}
        <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left">
          <div className="font-semibold flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            คำอธิบายกลไกความปลอดภัย (RBAC Guard):
          </div>
          <p>
            หน้านี้แสดงขึ้นเนื่องจากโค้ดใน <code>app/admin/page.tsx</code> ตรวจสอบพบว่า
            <code>session.user.role !== &quot;ADMIN&quot;</code> จึงทำการ redirect
            มายัง <code>/unauthorized</code> เพื่อป้องกันข้อมูลของระบบ
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 font-medium text-sm transition-colors shadow-sm"
          >
            กลับ Dashboard
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
          >
            หน้าแรก
          </button>
        </div>
      </div>
    </main>
  );
}
