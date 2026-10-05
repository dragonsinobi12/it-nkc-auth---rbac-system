// app/api/auth/[...nextauth]/route.ts
// NextAuth route handler for App Router
// ตามโจทย์ https://github.com/it-nkc/auth

import { handlers } from "@/app/auth";

export const { GET, POST } = handlers;
