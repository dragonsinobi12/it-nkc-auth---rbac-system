// src/pages/HomePage.tsx
import React from "react";
import { PageRoute, Session } from "../types";
import {
  ShieldCheck,
  Lock,
  Users,
  KeyRound,
  FileCode2,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Github,
  LogIn,
  Server,
} from "lucide-react";

interface HomePageProps {
  navigate: (route: PageRoute) => void;
  session: Session | null;
  onQuickLogin: (role: "ADMIN" | "STAFF" | "USER") => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  navigate,
  session,
  onQuickLogin,
}) => {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-700/50">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            ส่งงานวิชา Web App & Security | it-nkc/auth
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            ระบบยืนยันตัวตน & กำหนดสิทธิ์{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Authentication & RBAC
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            ระบบสมบูรณ์ตามโจทย์ <strong>it-nkc/auth</strong> พัฒนาด้วย Next.js, NextAuth (Auth.js),
            Prisma, bcryptjs และ GitHub OAuth 2.0 พร้อม Role-Based Access Control 3 ระดับ
            (ADMIN, STAFF, USER) และเอกสาร README.md คู่มือติดตั้งพร้อมส่งผ่าน GitHub Desktop
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              ทดลอง Login (Email/Pass & GitHub)
            </button>

            <button
              onClick={() => navigate("/admin")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3 text-sm font-semibold text-white border border-slate-600 transition-all active:scale-95"
            >
              <Lock className="w-4 h-4 text-red-400" />
              ทดสอบหน้า Admin (RBAC Guard)
            </button>

            <button
              onClick={() => navigate("/guide")}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 px-5 py-3 text-sm font-semibold text-indigo-200 border border-indigo-500/40 transition-all active:scale-95"
            >
              <GitBranch className="w-4 h-4" />
              วิธีส่งงานผ่าน GitHub Desktop
            </button>
          </div>
        </div>

        {/* Floating decoration */}
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Quick Test Accounts Card for Instructors */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-600" />
              บัญชีทดสอบระบบสำหรับผู้ตรวจงาน (Demo Credentials)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              คลิกปุ่ม &quot;สลับบัญชีทันที&quot; หรือนำไปกรอกในหน้า{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 underline font-medium"
              >
                /login
              </button>{" "}
              เพื่อทดสอบระบบการตรวจสอบสิทธิ์
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Admin Card */}
          <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                  Role: ADMIN
                </span>
                <span className="text-xs text-red-600 font-medium">เข้าได้ทุกหน้า</span>
              </div>
              <h3 className="font-bold text-slate-900">ผู้ดูแลระบบ (Admin)</h3>
              <div className="mt-3 space-y-1 text-xs text-slate-700 bg-white p-3 rounded-lg border border-red-100 font-mono">
                <div>
                  <span className="text-slate-400">Email:</span> admin@example.com
                </div>
                <div>
                  <span className="text-slate-400">Pass:</span> admin123
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                สามารถเข้าใช้งานหน้า <code>/admin</code> และ <code>/dashboard</code> ได้
              </p>
            </div>
            <button
              onClick={() => onQuickLogin("ADMIN")}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              สลับเป็น ADMIN ทันที
            </button>
          </div>

          {/* Staff Card */}
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                  Role: STAFF
                </span>
                <span className="text-xs text-amber-700 font-medium">สิทธิ์ระดับกลาง</span>
              </div>
              <h3 className="font-bold text-slate-900">เจ้าหน้าที่ (Staff)</h3>
              <div className="mt-3 space-y-1 text-xs text-slate-700 bg-white p-3 rounded-lg border border-amber-100 font-mono">
                <div>
                  <span className="text-slate-400">Email:</span> staff@example.com
                </div>
                <div>
                  <span className="text-slate-400">Pass:</span> staff123
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                เข้า <code>/dashboard</code> ได้ แต่เมื่อเข้า <code>/admin</code> จะถูกเด้งไปหน้า <code>/unauthorized</code>
              </p>
            </div>
            <button
              onClick={() => onQuickLogin("STAFF")}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              สลับเป็น STAFF ทันที
            </button>
          </div>

          {/* User Card */}
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  Role: USER
                </span>
                <span className="text-xs text-blue-600 font-medium">ผู้ใช้ทั่วไป</span>
              </div>
              <h3 className="font-bold text-slate-900">สมาชิกทั่วไป (User)</h3>
              <div className="mt-3 space-y-1 text-xs text-slate-700 bg-white p-3 rounded-lg border border-blue-100 font-mono">
                <div>
                  <span className="text-slate-400">Email:</span> user@example.com
                </div>
                <div>
                  <span className="text-slate-400">Pass:</span> user123
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                เมื่อเข้า <code>/admin</code> จะถูก redirect ไปยัง <code>/unauthorized</code> ทันที
              </p>
            </div>
            <button
              onClick={() => onQuickLogin("USER")}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              สลับเป็น USER ทันที
            </button>
          </div>
        </div>
      </section>

      {/* RBAC Access Matrix Table */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          ตารางการควบคุมสิทธิ์ตามบทบาท (Role-Based Access Control Matrix)
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          ตรวจสอบการเข้าถึงหน้าต่างๆ ตามตารางนี้เพื่อทดสอบว่าระบบทำหน้าที่ป้องกันหน้าเว็บได้อย่างถูกต้อง
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3.5 font-semibold">หน้า (Route)</th>
                <th className="p-3.5 font-semibold">Guest (ยังไม่ล็อกอิน)</th>
                <th className="p-3.5 font-semibold">USER (ผู้ใช้ทั่วไป)</th>
                <th className="p-3.5 font-semibold">STAFF (เจ้าหน้าที่)</th>
                <th className="p-3.5 font-semibold">ADMIN (ผู้ดูแลระบบ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="p-3.5 font-mono text-slate-800 font-medium">/ (หน้าแรก)</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ เข้าได้</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ เข้าได้</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ เข้าได้</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ เข้าได้</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3.5 font-mono text-slate-800 font-medium">/login & /signup</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ เข้าได้</td>
                <td className="p-3.5 text-slate-500">🔄 เข้าได้ / redirect</td>
                <td className="p-3.5 text-slate-500">🔄 เข้าได้ / redirect</td>
                <td className="p-3.5 text-slate-500">🔄 เข้าได้ / redirect</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3.5 font-mono text-slate-800 font-medium">/dashboard</td>
                <td className="p-3.5 text-amber-600 font-semibold">🔒 ไปที่ /login</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ เข้าได้</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ เข้าได้</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ เข้าได้</td>
              </tr>
              <tr className="bg-red-50/30 hover:bg-red-50/50">
                <td className="p-3.5 font-mono text-red-900 font-bold">/admin (เป้าหมายหลัก)</td>
                <td className="p-3.5 text-red-600 font-semibold">🔒 ไปที่ /login</td>
                <td className="p-3.5 text-red-600 font-semibold">🚫 ไปที่ /unauthorized</td>
                <td className="p-3.5 text-red-600 font-semibold">🚫 ไปที่ /unauthorized</td>
                <td className="p-3.5 text-emerald-600 font-bold">✅ เข้าได้ (ADMIN Only)</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3.5 font-mono text-slate-800 font-medium">/unauthorized</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ แสดงหน้า 🚫</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ แสดงหน้า 🚫</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ แสดงหน้า 🚫</td>
                <td className="p-3.5 text-emerald-600 font-semibold">✅ แสดงหน้า 🚫</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Feature Highlights matching it-nkc/auth */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            1. Email / Password & bcrypt
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            ระบบตรวจสอบรหัสผ่านด้วย <code>bcrypt.compare</code> และการ Hash รหัสผ่านด้วย Salt Round
            12 สำหรับผู้ลงทะเบียนใหม่ พร้อมการตรวจสอบ Email ซ้ำ และรูปแบบ Regex
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white mb-4">
            <Github className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            2. GitHub OAuth 2.0
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            รองรับการลงชื่อเข้าใช้ด้วย GitHub OAuth App ตามที่กำหนดในโจทย์ โดยกำหนดให้ผู้ใช้ที่ล็อกอินผ่าน
            GitHub ได้รับ Role <code>USER</code> เป็นค่าเริ่มต้นโดยอัตโนมัติ
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
            <Server className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            3. NextAuth v5 & Prisma Schema
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            โครงสร้างไฟล์โค้ดแบบ <code>app/auth.ts</code>, <code>prisma/schema.prisma</code>,
            <code>app/api/auth/[...nextauth]</code> และ Server Actions ครบถ้วนตามมาตรฐาน
          </p>
        </div>
      </section>
    </div>
  );
};
