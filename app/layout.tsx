// app/layout.tsx
// Root layout for Next.js app
import React from "react";

export const metadata = {
  title: "IT-NKC Auth & RBAC Demo",
  description: "Next.js Authentication and Role-Based Access Control demo project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="antialiased min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
