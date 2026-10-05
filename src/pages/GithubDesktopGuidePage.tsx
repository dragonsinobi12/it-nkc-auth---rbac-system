// src/pages/GithubDesktopGuidePage.tsx
import React, { useState } from "react";
import { PageRoute } from "../types";
import {
  GitBranch,
  Github,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  FolderGit2,
  UploadCloud,
  FileText,
  AlertCircle,
} from "lucide-react";

interface GuideProps {
  navigate: (route: PageRoute) => void;
}

export const GithubDesktopGuidePage: React.FC<GuideProps> = ({ navigate }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      step: 1,
      title: "เตรียมโปรเจกต์และตรวจสอบไฟล์",
      description: "ตรวจสอบให้แน่ใจว่าโฟลเดอร์โปรเจกต์มีไฟล์ครบถ้วนตามโจทย์ it-nkc/auth",
      details: [
        "มีไฟล์ README.md ที่มีคำอธิบายการติดตั้งและการใช้งานอย่างละเอียด",
        "มีไฟล์ prisma/schema.prisma ที่กำหนดโมเดล User และ Enum Role (ADMIN, STAFF, USER)",
        "มีไฟล์ app/auth.ts และ app/api/auth/[...nextauth]/route.ts",
        "มีไฟล์ app/login/page.tsx, app/signup/page.tsx, app/admin/page.tsx, app/unauthorized/page.tsx",
        "มีไฟล์ .env.example ที่มีตัวแปรครบถ้วน",
      ],
    },
    {
      step: 2,
      title: "เปิดโปรแกรม GitHub Desktop และเพิ่มโปรเจกต์",
      description: "นำโฟลเดอร์โปรเจกต์เข้าสู่ GitHub Desktop",
      details: [
        "เปิดโปรแกรม GitHub Desktop บนคอมพิวเตอร์ของคุณ",
        "ไปที่เมนู File > Add Local Repository... (หรือกดปุ่มลัด Ctrl + O บน Windows / Cmd + O บน Mac)",
        "กดปุ่ม Choose... แล้วเลือกโฟลเดอร์ของโปรเจกต์นี้",
        "หากโปรแกรมแจ้งเตือนว่า 'This directory does not appear to be a Git repository' ให้กดคลิกสร้าง repository ได้ทันที (Create a repository here)",
      ],
    },
    {
      step: 3,
      title: "ตรวจสอบ Changes และทำการ Commit",
      description: "บันทึกการเปลี่ยนแปลงทั้งหมดเข้าสู่ Git",
      details: [
        "ที่แท็บด้านซ้ายของ GitHub Desktop ในส่วน 'Changes' จะเห็นรายการไฟล์ทั้งหมด",
        "ที่ช่อง Summary ด้านล่างซ้าย พิมพ์ข้อความ Commit เช่น: feat: complete it-nkc auth and rbac system with readme",
        "ที่ช่อง Description (ถ้าต้องการ): Add email/password & github login, role access control and docs",
        "กดปุ่มสีฟ้า 'Commit to main' (หรือ 'Commit to master')",
      ],
    },
    {
      step: 4,
      title: "Publish Repository ขึ้นไปยัง GitHub.com",
      description: "อัปโหลดโปรเจกต์ขึ้นสู่บัญชี GitHub ของคุณ",
      details: [
        "กดปุ่ม 'Publish repository' ที่แถบด้านบนของ GitHub Desktop",
        "ตั้งชื่อ Repository เช่น: it-nkc-auth หรือ nextjs-auth-rbac",
        "ติ๊กเอาเครื่องหมายถูกออกจาก 'Keep this code private' (เพื่อให้ Repository เป็น Public หรือตามที่อาจารย์ผู้สอนกำหนด)",
        "กดปุ่ม 'Publish Repository'",
      ],
    },
    {
      step: 5,
      title: "คัดลอกลิงก์ Repository และส่งงานให้อาจารย์",
      description: "นำลิงก์ GitHub ไปส่งตามช่องทางของมหาวิทยาลัย",
      details: [
        "ไปที่เมนู Repository > View on GitHub เพื่อเปิดหน้าคลังโค้ดของคุณบนเบราว์เซอร์",
        "ตรวจสอบว่ามีไฟล์ README.md แสดงผลหน้าแรกอย่างสวยงามพร้อมวิธีใช้งาน",
        "คัดลอก URL เช่น: https://github.com/your-username/it-nkc-auth ส่งตามช่องทางที่อาจารย์กำหนด",
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 p-8 text-white shadow-xl">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-2">
          <FolderGit2 className="w-4 h-4" />
          SUBMISSION WORKFLOW
        </div>
        <h1 className="text-3xl font-extrabold">
          คู่มือการส่งงานขึ้น GitHub ด้วย GitHub Desktop
        </h1>
        <p className="text-slate-300 text-sm mt-2 leading-relaxed">
          ขั้นตอนอย่างละเอียดสำหรับนักศึกษาในการนำโปรเจกต์นี้ส่งขึ้น GitHub.com
          พร้อม README.md ตามโจทย์ของแล็บวิชา
        </p>
      </div>

      {/* Checklist Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          สิ่งที่เตรียมไว้ให้ครบถ้วนในโปรเจกต์นี้
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">README.md คุณภาพสูง</span>
              <p className="text-xs text-slate-500 mt-0.5">
                มีวิธีติดตั้ง, วิธีการรัน, วิธีตั้งค่า OAuth, ตาราง RBAC และบัญชีทดสอบ
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">Prisma Schema & Enum Role</span>
              <p className="text-xs text-slate-500 mt-0.5">
                ตาราง User พร้อม Enum Role (ADMIN, STAFF, USER) ครบถ้วน
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">ระบบ Login & Signup & Unauthorized</span>
              <p className="text-xs text-slate-500 mt-0.5">
                มีหน้า /login, /signup, /admin, /unauthorized, /login-github
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">GitHub OAuth Integration</span>
              <p className="text-xs text-slate-500 mt-0.5">
                กำหนด callback และ Default Role = USER ตามโจทย์
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step by step cards */}
      <div className="space-y-5">
        {steps.map((item, index) => (
          <div
            key={item.step}
            className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 transition-all hover:border-slate-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow">
                {item.step}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>

                <ul className="mt-3 space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold shrink-0">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Commit Message */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400">
            ข้อความ Commit แนะนำสำหรับ GitHub Desktop:
          </span>
          <button
            onClick={() =>
              copyToClipboard(
                "feat: implement authentication and rbac system according to it-nkc/auth with full readme",
                99,
              )
            }
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {copiedIndex === 99 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                คัดลอกแล้ว
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                คัดลอกข้อความ
              </>
            )}
          </button>
        </div>
        <div className="p-3 bg-slate-950 rounded-lg font-mono text-xs text-emerald-400 break-all border border-slate-800">
          feat: implement authentication and rbac system according to it-nkc/auth with full readme
        </div>
      </div>
    </div>
  );
};
