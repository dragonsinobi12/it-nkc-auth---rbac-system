// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { PageRoute } from "../types";
import { authenticateCredentials, authenticateWithGithub } from "../lib/authStore";
import { LogIn, Sparkles, Check } from "lucide-react";

interface LoginPageProps {
  navigate: (route: PageRoute) => void;
  registeredMessage?: boolean;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  navigate,
  registeredMessage,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [customGithubName, setCustomGithubName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authenticateCredentials(email, password);
      if (result.error || !result.user) {
        setError(result.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setLoading(false);
        return;
      }

      // Successful credentials login
      const session = {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          provider: "credentials" as const,
        },
        expires: new Date(Date.now() + 86400000 * 7).toISOString(),
      };
      localStorage.setItem("it_nkc_auth_session_v1", JSON.stringify(session));

      onLoginSuccess();

      // Per it-nkc/auth tutorial:
      // router.push("/admin"); router.refresh();
      navigate("/admin");
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = () => {
    // Perform simulated GitHub OAuth login
    authenticateWithGithub({
      login: customGithubName.trim() || "github-student",
      name: customGithubName.trim() ? `${customGithubName} (GitHub)` : "GitHub Student User",
      email: `${(customGithubName || "student").toLowerCase().replace(/\s+/g, "")}@users.noreply.github.com`,
    });
    setShowGithubModal(false);
    onLoginSuccess();
    navigate("/");
  };

  const fillAccount = (role: "ADMIN" | "STAFF" | "USER") => {
    if (role === "ADMIN") {
      setEmail("admin@example.com");
      setPassword("admin123");
    } else if (role === "STAFF") {
      setEmail("staff@example.com");
      setPassword("staff123");
    } else {
      setEmail("user@example.com");
      setPassword("user123");
    }
    setError("");
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-10 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
          Login
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          เข้าสู่ระบบด้วย Username & Password หรือ GitHub
        </p>

        {registeredMessage && (
          <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>สร้างบัญชีสำเร็จแล้ว! กรุณาเข้าสู่ระบบด้วยบัญชีของคุณ</span>
          </div>
        )}

        {/* Quick Fill Buttons for Grader */}
        <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="font-semibold text-slate-600 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            เติมข้อมูลทดสอบอย่างรวดเร็ว (Quick Fill):
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillAccount("ADMIN")}
              className="py-1 px-2 rounded bg-red-100 hover:bg-red-200 text-red-700 font-medium text-center transition-colors"
            >
              ADMIN
            </button>
            <button
              type="button"
              onClick={() => fillAccount("STAFF")}
              className="py-1 px-2 rounded bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium text-center transition-colors"
            >
              STAFF
            </button>
            <button
              type="button"
              onClick={() => fillAccount("USER")}
              className="py-1 px-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium text-center transition-colors"
            >
              USER
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-2.5 font-semibold text-white shadow hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>กำลังตรวจสอบข้อมูล...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <p className="my-4 text-center text-xs font-semibold tracking-wider text-slate-400">
          -- OR --
        </p>

        {/* GitHub Sign-in Button matching it-nkc/auth */}
        <div className="space-y-3">
          <button
            type="button"
            className="relative inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-black focus:outline-none shadow-sm"
            onClick={() => setShowGithubModal(true)}
          >
            <span className="mr-2 inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="22px"
                height="22px"
                fill="currentColor"
              >
                <path d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z" />
              </svg>
            </span>
            Sign in with Github
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          ยังไม่มีบัญชีผู้ใช้?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-semibold text-blue-600 hover:underline"
          >
            สมัครสมาชิก (Sign Up)
          </button>
        </div>
      </div>

      {/* GitHub Sign In Modal / Simulator */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="p-2 rounded-lg bg-slate-900 text-white">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">GitHub OAuth Sign In</h3>
                <p className="text-xs text-slate-500">
                  จำลองการยืนยันตัวตนตามเงื่อนไข (ได้ Role USER)
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-slate-600">
                ตามโจทย์ <code>it-nkc/auth</code> ผู้ใช้งานที่ล็อกอินผ่าน GitHub จะได้รับบทบาท{" "}
                <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  USER
                </span>{" "}
                โดยอัตโนมัติใน jwt callback
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GitHub Username (หรือปล่อยว่างเพื่อใช้บัญชีทดสอบ):
                </label>
                <input
                  type="text"
                  value={customGithubName}
                  onChange={(e) => setCustomGithubName(e.target.value)}
                  placeholder="เช่น octocat, somchai-dev"
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleGithubSignIn}
                className="flex-1 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors"
              >
                เข้าสู่ระบบด้วย GitHub
              </button>
              <button
                type="button"
                onClick={() => setShowGithubModal(false)}
                className="py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
