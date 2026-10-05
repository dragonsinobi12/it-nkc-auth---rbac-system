// src/pages/DashboardPage.tsx
import React from "react";
import { PageRoute, Session } from "../types";
import {
  UserCheck,
  ShieldCheck,
  Lock,
  LogOut,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

interface DashboardPageProps {
  navigate: (route: PageRoute) => void;
  session: Session | null;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  navigate,
  session,
  onLogout,
}) => {
  if (!session?.user) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-200">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">ยังไม่ได้เข้าสู่ระบบ</h2>
          <p className="text-slate-600 text-sm mb-6">
            กรุณาเข้าสู่ระบบก่อนเพื่อเข้าถึงหน้า Dashboard
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            ไปที่หน้า Login
          </button>
        </div>
      </div>
    );
  }

  const role = session.user.role;

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10 space-y-6 max-w-4xl mx-auto">
      {/* Top Profile Card */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">User Dashboard</h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                role === "ADMIN"
                  ? "bg-red-100 text-red-700"
                  : role === "STAFF"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {role}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            ข้อมูลผู้ใช้งานและสิทธิ์การเข้าถึงระบบ
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === "ADMIN" ? (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              เข้าสู่หน้า Admin
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold shadow-sm transition-colors"
              title="เมื่อกดปุ่มนี้ ระบบจะตรวจสอบว่าคุณไม่ใช่ ADMIN แล้ว redirect ไปยัง /unauthorized"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              ทดสอบเข้าหน้า Admin (จะถูกบล็อก)
            </button>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </button>
        </div>
      </header>

      {/* User Info Details */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-600" />
          ข้อมูลโปรไฟล์ของคุณ (Session Data)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">ชื่อ (Name)</span>
            <span className="text-base font-semibold text-slate-900">
              {session.user.name || "ไม่ระบุชื่อ"}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">อีเมล (Email)</span>
            <span className="text-base font-semibold text-slate-900">
              {session.user.email}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">บทบาท (Role)</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  role === "ADMIN"
                    ? "bg-red-100 text-red-700"
                    : role === "STAFF"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {role}
              </span>
              <span className="text-xs text-slate-500">
                {role === "ADMIN"
                  ? "มีสิทธิ์สูงสุดในการดูแลระบบ"
                  : role === "STAFF"
                  ? "มีสิทธิ์ระดับเจ้าหน้าที่"
                  : "มีสิทธิ์ระดับผู้ใช้งานทั่วไป"}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">
              ช่องทางการเข้าสู่ระบบ (Provider)
            </span>
            <span className="text-sm font-medium text-slate-800">
              {session.user.provider === "github" ? "GitHub OAuth 2.0" : "Credentials (Email/Password)"}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 md:col-span-2">
            <span className="text-xs text-slate-500 block mb-1">
              รหัสประจำตัวผู้ใช้ (User ID)
            </span>
            <span className="text-xs font-mono text-slate-700 break-all">
              {session.user.id}
            </span>
          </div>
        </div>
      </section>

      {/* RBAC Verification Box */}
      <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-2">การทดสอบ RBAC สำหรับผู้ใช้งานปัจจุบัน</h3>
        <p className="text-sm text-slate-600 mb-4">
          ตามโจทย์ เมื่อบัญชีบทบาท <strong className="text-blue-600">{role}</strong> พยายามเข้าถึงหน้า <code>/admin</code>:
        </p>

        {role === "ADMIN" ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
            🎉 คุณมีบทบาท <strong>ADMIN</strong> จึงสามารถเข้าใช้งานหน้า{" "}
            <code>/admin</code> ได้อย่างสมบูรณ์
          </div>
        ) : (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            ⚠️ บัญชีของคุณไม่ใช่ <strong>ADMIN</strong> (ปัจจุบันคือ {role}) ดังนั้นหากเข้าหน้า{" "}
            <code>/admin</code> ระบบจะทำการพาคุณไปยังหน้า <code>/unauthorized</code> ทันที
          </div>
        )}
      </section>
    </div>
  );
};
