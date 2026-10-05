// src/pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import { PageRoute, Session, User, Role } from "../types";
import { getUsers, updateUserRole } from "../lib/authStore";
import {
  ShieldAlert,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Key,
  Edit,
  ArrowRight,
} from "lucide-react";

interface AdminPageProps {
  navigate: (route: PageRoute) => void;
  session: Session | null;
  onRefreshSession: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  navigate,
  session,
  onRefreshSession,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // RBAC Protection guard as instructed in it-nkc/auth:
  // if (!session?.user) redirect("/login");
  // if (session.user.role !== "ADMIN") redirect("/unauthorized");
  useEffect(() => {
    if (!session || !session.user) {
      navigate("/login");
      return;
    }
    if (session.user.role !== "ADMIN") {
      navigate("/unauthorized");
      return;
    }
    setUsers(getUsers());
  }, [session, navigate]);

  if (!session?.user || session.user.role !== "ADMIN") {
    return null; // Will redirect via useEffect
  }

  const handleRoleChange = (userId: string, newRole: Role) => {
    updateUserRole(userId, newRole);
    setUsers(getUsers());
    onRefreshSession();
    setEditingUserId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header matching it-nkc/auth */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              RESTRICTED AREA: ADMIN ONLY
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1">เฉพาะ ADMIN เท่านั้น</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              หน้าแรก
            </button>
          </div>
        </div>

        {/* Verification Success Box */}
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900 text-sm">
                การตรวจสอบสิทธิ์ RBAC ผ่านสำเร็จ (Access Granted)
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                บัญชี <strong>{session.user.email}</strong> มีสิทธิ์ระดับ{" "}
                <span className="font-bold underline">ADMIN</span> จึงผ่านเงื่อนไข{" "}
                <code>session.user.role === &quot;ADMIN&quot;</code> ในไฟล์{" "}
                <code>app/admin/page.tsx</code>
              </p>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <span className="text-xs text-slate-500 font-medium">ผู้ใช้งานทั้งหมดในระบบ</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {users.length} บัญชี
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              จำลองตาราง Prisma User
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <span className="text-xs text-slate-500 font-medium">การเข้ารหัสรหัสผ่าน</span>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              bcrypt (12 rounds)
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              เก็บเป็น PasswordHash ปลอดภัย
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <span className="text-xs text-slate-500 font-medium">เซสชันผู้ดูแลระบบ</span>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {session.user.role}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block truncate">
              ID: {session.user.id}
            </span>
          </div>
        </div>

        {/* User Management Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-700" />
              รายชื่อผู้ใช้และบทบาทในฐานข้อมูล (Prisma User Table)
            </h2>
            <span className="text-xs text-slate-500">
              ผู้ดูแลระบบสามารถปรับเปลี่ยนบทบาทผู้ใช้ได้ที่นี่
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="p-3">ชื่อ / Email</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Role ปัจจุบัน</th>
                  <th className="p-3">Password Hash (bcrypt)</th>
                  <th className="p-3 text-right">ปรับเปลี่ยนสิทธิ์</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">
                        {u.name || "ไม่มีชื่อ"}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {u.email}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {u.provider === "github" ? "GitHub OAuth" : "Credentials"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.role === "ADMIN"
                            ? "bg-red-100 text-red-700"
                            : u.role === "STAFF"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[11px] font-mono text-slate-400 truncate max-w-[120px] block" title={u.passwordHash}>
                        {u.passwordHash ? u.passwordHash.substring(0, 16) + "..." : "(OAuth No Pass)"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {["ADMIN", "STAFF", "USER"].map((roleOption) => (
                          <button
                            key={roleOption}
                            disabled={u.role === roleOption}
                            onClick={() => handleRoleChange(u.id, roleOption as Role)}
                            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                              u.role === roleOption
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }`}
                          >
                            {roleOption}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
