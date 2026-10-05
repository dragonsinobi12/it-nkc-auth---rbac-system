// src/App.tsx
import React, { useState, useEffect } from "react";
import { PageRoute, Session, Role } from "./types";
import {
  getSession,
  saveSession,
  resetDatabase,
  getUsers,
} from "./lib/authStore";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { LoginGithubPage } from "./pages/LoginGithubPage";
import { SignUpPage } from "./pages/SignUpPage";
import { AdminPage } from "./pages/AdminPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { DashboardPage } from "./pages/DashboardPage";
import { GithubDesktopGuidePage } from "./pages/GithubDesktopGuidePage";
import { CodeViewerPage } from "./pages/CodeViewerPage";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>("/");
  const [session, setSession] = useState<Session | null>(null);
  const [registeredMessage, setRegisteredMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize session on mount and handle hash-based simple routing
  useEffect(() => {
    setSession(getSession());

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as PageRoute;
      if (
        [
          "/",
          "/login",
          "/login-github",
          "/signup",
          "/admin",
          "/unauthorized",
          "/dashboard",
          "/guide",
          "/code",
        ].includes(hash)
      ) {
        setCurrentRoute(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (route: PageRoute) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    saveSession(null);
    setSession(null);
    showToast("ออกจากระบบสำเร็จแล้ว");
    navigate("/");
  };

  const handleQuickLogin = (role: Role) => {
    const users = getUsers();
    const targetUser = users.find((u) => u.role === role);
    if (!targetUser) return;

    const newSession: Session = {
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        provider: targetUser.provider,
      },
      expires: new Date(Date.now() + 86400000 * 7).toISOString(),
    };

    saveSession(newSession);
    setSession(newSession);
    showToast(`สลับบัญชีเป็น ${role} (${targetUser.email}) สำเร็จ!`);

    if (role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleResetDatabase = () => {
    if (confirm("ต้องการรีเซ็ตฐานข้อมูลและเซสชันกลับสู่ค่าเริ่มต้นใช่หรือไม่?")) {
      resetDatabase();
      setSession(null);
      showToast("รีเซ็ตฐานข้อมูลเริ่มต้นเรียบร้อยแล้ว");
      navigate("/");
    }
  };

  const refreshSession = () => {
    setSession(getSession());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-2xl text-sm font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Navbar with quick role switcher */}
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        session={session}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
      />

      {/* Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRoute === "/" && (
          <HomePage
            navigate={navigate}
            session={session}
            onQuickLogin={handleQuickLogin}
          />
        )}

        {currentRoute === "/login" && (
          <LoginPage
            navigate={navigate}
            registeredMessage={registeredMessage}
            onLoginSuccess={() => {
              setRegisteredMessage(false);
              setSession(getSession());
            }}
          />
        )}

        {currentRoute === "/login-github" && (
          <LoginGithubPage
            navigate={navigate}
            onLoginSuccess={() => setSession(getSession())}
          />
        )}

        {currentRoute === "/signup" && (
          <SignUpPage
            navigate={navigate}
            setRegisteredMessage={setRegisteredMessage}
          />
        )}

        {currentRoute === "/admin" && (
          <AdminPage
            navigate={navigate}
            session={session}
            onRefreshSession={refreshSession}
          />
        )}

        {currentRoute === "/unauthorized" && (
          <UnauthorizedPage navigate={navigate} />
        )}

        {currentRoute === "/dashboard" && (
          <DashboardPage
            navigate={navigate}
            session={session}
            onLogout={handleLogout}
          />
        )}

        {currentRoute === "/guide" && (
          <GithubDesktopGuidePage navigate={navigate} />
        )}

        {currentRoute === "/code" && (
          <CodeViewerPage navigate={navigate} />
        )}
      </main>

      {/* Footer */}
      <Footer navigate={navigate} onResetDatabase={handleResetDatabase} />
    </div>
  );
}
