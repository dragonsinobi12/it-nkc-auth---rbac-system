// app/signup/actions.ts
// Server Action สำหรับการลงทะเบียนผู้ใช้ใหม่
// ตามโจทย์ https://github.com/it-nkc/auth

"use server";

import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export type SignUpState = {
  error?: string;
  success?: boolean;
};

export async function signUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  // ตรวจสอบข้อมูลว่ากรอกครบหรือไม่
  if (!name || !email || !password || !confirmPassword) {
    return {
      error: "กรุณากรอกข้อมูลให้ครบถ้วน",
    };
  }

  // ตรวจสอบ password ความยาวอย่างน้อย 6 ตัวอักษร
  if (password.length < 6) {
    return {
      error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
    };
  }

  // ตรวจสอบว่า password ตรงกับ confirmPassword หรือไม่
  if (password !== confirmPassword) {
    return {
      error: "รหัสผ่านไม่ตรงกัน",
    };
  }

  // ตรวจสอบรูปแบบ email ด้วย regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      error: "รูปแบบ Email ไม่ถูกต้อง",
    };
  }

  // ตรวจสอบว่ามี User ที่ใช้อีเมลนี้อยู่แล้วหรือไม่
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      error: "Email นี้ถูกใช้งานแล้ว",
    };
  }

  // ทำการ Hash รหัสผ่านด้วย bcryptjs (salt rounds = 12)
  const passwordHash = await bcrypt.hash(password, 12);

  // สร้าง User ในฐานข้อมูล
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      // ผู้สมัครใหม่:
      // สามารถกำหนดเป็น USER หรือ ADMIN ตามโจทย์การทดสอบ
      role: "USER",
    },
  });

  return {
    success: true,
  };
}
