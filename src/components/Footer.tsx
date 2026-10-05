// src/components/Footer.tsx
import React from "react";
import { PageRoute } from "../types";
import { Github, RotateCcw, ShieldCheck, Heart } from "lucide-react";

interface FooterProps {
  navigate: (route: PageRoute) => void;
  onResetDatabase: () => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, onResetDatabase }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">
              IT-NKC Authentication & RBAC System
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => navigate("/guide")}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              คู่มือ GitHub Desktop
            </button>
            <button
              onClick={() => navigate("/code")}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              โค้ดไฟล์ทั้งหมด
            </button>
            <a
              href="https://github.com/it-nkc/auth"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>it-nkc/auth</span>
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            พัฒนาตามโจทย์แล็บวิชาการยืนยันตัวตนและการจัดการสิทธิ์ (IT-NKC)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetDatabase}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-[11px]"
              title="ล้างข้อมูลผู้ใช้ที่สร้างใหม่และเซสชัน กลับสู่ค่าเริ่มต้น"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ตฐานข้อมูลเริ่มต้น</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
