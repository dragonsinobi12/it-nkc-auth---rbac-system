// src/components/Navbar.tsx
import React from "react";
import { PageRoute, Session } from "../types";
import {
  ShieldCheck,
  UserCheck,
  LogOut,
  LogIn,
  UserPlus,
  BookOpen,
  Code2,
  Home,
  ShieldAlert,
  Sparkles,
  GitBranch,
} from "lucide-react";

interface NavbarProps {
  currentRoute: PageRoute;
  navigate: (route: PageRoute) => void;
  session: Session | null;
  onLogout: () => void;
  onQuickLogin: (role: "ADMIN" | "STAFF" | "USER") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  session,
  onLogout,
  onQuickLogin,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner: Quick Role Switcher for Graders / Testers */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">
            โหมดทดสอบ RBAC สำหรับตรวจงาน (Quick Role Switcher):
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onQuickLogin("ADMIN")}
            className="px-2.5 py-0.5 rounded bg-red-600 hover:bg-red-500 font-semibold text-white transition-colors"
            title="เข้าสู่ระบบทันทีในฐานะ ADMIN"
          >
            👑 ADMIN (admin@example.com)
          </button>
          <button
            onClick={() => onQuickLogin("STAFF")}
            className="px-2.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 font-semibold text-white transition-colors"
            title="เข้าสู่ระบบทันทีในฐานะ STAFF"
          >
            💼 STAFF (staff@example.com)
          </button>
          <button
            onClick={() => onQuickLogin("USER")}
            className="px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors"
            title="เข้าสู่ระบบทันทีในฐานะ USER"
          >
            👤 USER (user@example.com)
          </button>
          {session && (
            <button
              onClick={onLogout}
              className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
            >
              เคลียร์เซสชัน
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg">
                  IT-NKC Auth
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider bg-blue-100 text-blue-800 rounded">
                  RBAC SYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Authentication & Role-Based Access Control
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigate("/")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentRoute === "/"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Home className="w-4 h-4" />
              หน้าแรก
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentRoute === "/dashboard"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => navigate("/admin")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentRoute === "/admin"
                  ? "bg-red-50 text-red-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Admin Panel
            </button>
            <button
              onClick={() => navigate("/guide")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentRoute === "/guide"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <GitBranch className="w-4 h-4 text-indigo-500" />
              วิธีส่งงาน GitHub
            </button>
            <button
              onClick={() => navigate("/code")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentRoute === "/code"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-600" />
              โค้ดที่สร้าง
            </button>
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <div
                  className="hidden sm:flex flex-col text-right cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  <span className="text-xs font-semibold text-slate-800 truncate max-w-[140px]">
                    {session.user.name || session.user.email}
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        session.user.role === "ADMIN"
                          ? "bg-red-100 text-red-700"
                          : session.user.role === "STAFF"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {session.user.role}
                    </span>
                    {session.user.provider === "github" && (
                      <span className="text-[10px] text-slate-500">via GitHub</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar for Easy Route Navigation */}
      <div className="flex md:hidden border-t border-slate-200 bg-slate-50 px-2 py-1 justify-around text-xs">
        <button
          onClick={() => navigate("/")}
          className={`p-1.5 rounded ${currentRoute === "/" ? "text-blue-600 font-bold" : "text-slate-600"}`}
        >
          หน้าแรก
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className={`p-1.5 rounded ${currentRoute === "/dashboard" ? "text-blue-600 font-bold" : "text-slate-600"}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/admin")}
          className={`p-1.5 rounded ${currentRoute === "/admin" ? "text-red-600 font-bold" : "text-slate-600"}`}
        >
          Admin
        </button>
        <button
          onClick={() => navigate("/guide")}
          className={`p-1.5 rounded ${currentRoute === "/guide" ? "text-indigo-600 font-bold" : "text-slate-600"}`}
        >
          คู่มือส่งงาน
        </button>
        <button
          onClick={() => navigate("/code")}
          className={`p-1.5 rounded ${currentRoute === "/code" ? "text-emerald-600 font-bold" : "text-slate-600"}`}
        >
          ไฟล์โค้ด
        </button>
      </div>
    </header>
  );
};
