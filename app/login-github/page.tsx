// app/login-github/page.tsx
// หน้า Login สำหรับผู้ใช้ GitHub โดยเฉพาะ
// ตามโจทย์ https://github.com/it-nkc/auth

import { redirect } from "next/navigation";
import { auth, signIn } from "@/app/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-md px-5 py-20">
      <section className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Members Only</h1>
        <p className="mt-3 text-slate-600">เข้าสู่ระบบด้วย github</p>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/" });
          }}
        >
          <button className="mt-8 w-full rounded-lg bg-slate-950 px-5 py-3 font-medium text-white hover:bg-slate-800">
            Continue with GitHub
          </button>
        </form>
      </section>
    </main>
  );
}
