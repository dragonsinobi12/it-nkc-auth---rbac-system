// src/pages/SignUpPage.tsx
import React, { useState } from "react";
import { PageRoute } from "../types";
import { registerUser } from "../lib/authStore";
import { UserPlus, CheckCircle2 } from "lucide-react";

interface SignUpPageProps {
  navigate: (route: PageRoute) => void;
  setRegisteredMessage: (show: boolean) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  navigate,
  setRegisteredMessage,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);

    try {
      const result = await registerUser({
        name,
        email,
        password,
        confirmPassword,
      });

      if (result.error) {
        setError(result.error);
        setPending(false);
        return;
      }

      // Success: redirect to /login with registered status
      setRegisteredMessage(true);
      navigate("/login");
    } catch {
      setError("เกิดข้อผิดพลาดในการลงทะเบียน");
      setPending(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
          Sign Up
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">สร้างบัญชีผู้ใช้งานใหม่</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              ชื่อ
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="ชื่อของคุณ"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="อย่างน้อย 6 ตัวอักษร"
              minLength={6}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              minLength={6}
              required
            />
          </div>

          {/* Error display */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {pending ? (
              <span>กำลังสร้างบัญชี...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>สร้างบัญชี</span>
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-slate-600">
          มีบัญชีอยู่แล้ว?{" "}
          <button
            onClick={() => navigate("/login")}
            className="ml-1 font-medium text-blue-600 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
};
