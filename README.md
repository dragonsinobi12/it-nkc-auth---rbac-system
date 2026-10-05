# ระบบยืนยันตัวตน (Authentication) และจัดการสิทธิ์ (RBAC) ด้วย Username/Password และ GitHub OAuth

> **โครงงานส่งงานวิชา Web Application Development & Security**  
> อ้างอิงตามโจทย์หลักสูตร: [https://github.com/it-nkc/auth](https://github.com/it-nkc/auth)

---

## 📌 สรุปภาพรวมของระบบ (Project Overview)

ระบบนี้เป็นเว็บแอปพลิเคชันที่พัฒนาขึ้นเพื่อจัดการการยืนยันตัวตน (Authentication) และการควบคุมการเข้าถึงตามบทบาท (Role-Based Access Control หรือ RBAC) โดยรองรับทั้งการเข้าสู่ระบบแบบดั้งเดิม (Email & Password พร้อมการเข้ารหัสด้วย **bcryptjs**) และการเข้าสู่ระบบผ่านผู้ให้บริการภายนอก (**GitHub OAuth 2.0**) ผ่าน **NextAuth (Auth.js v5)** และจัดการฐานข้อมูลด้วย **Prisma ORM**

---

## ✨ คุณสมบัติเด่นของระบบ (Key Features)

### 1. การยืนยันตัวตน (Authentication)
* **Email & Password Login:**
  * ตรวจสอบความถูกต้องของบัญชีผู้ใช้จากฐานข้อมูล
  * ถอดรหัสเปรียบเทียบรหัสผ่านด้วย `bcrypt.compare` อย่างปลอดภัย
* **GitHub OAuth 2.0 Login:**
  * ลงชื่อเข้าใช้งานด้วยบัญชี GitHub ได้ในคลิกเดียว
  * กำหนดให้ผู้ใช้ที่ล็อกอินผ่าน GitHub ได้รับ Role เป็น `USER` โดยอัตโนมัติในระดับ JWT Callback

### 2. การควบคุมสิทธิ์การเข้าถึง (Role-Based Access Control - RBAC)
ระบบรองรับ 3 ระดับสิทธิ์ (Enum Role):
1. **👑 ADMIN (ผู้ดูแลระบบ):**
   * เข้าถึงหน้า `/admin` (Admin Dashboard) ได้
   * เข้าถึงหน้า `/dashboard` ได้
   * จัดการบทบาทและตรวจสอบข้อมูลผู้ใช้งานทั้งหมดได้
2. **💼 STAFF (เจ้าหน้าที่):**
   * เข้าถึงหน้า `/dashboard` ได้
   * **ไม่สามารถ** เข้าถึงหน้า `/admin` ได้ (จะถูก Redirect ไปยัง `/unauthorized`)
3. **👤 USER (ผู้ใช้ทั่วไป):**
   * เข้าถึงหน้า `/dashboard` ได้
   * **ไม่สามารถ** เข้าถึงหน้า `/admin` ได้ (จะถูก Redirect ไปยัง `/unauthorized`)

### 3. หน้าจัดการสิทธิ์และข้อผิดพลาด (Route Guards)
* **`/admin`:** ตรวจสอบเซสชัน หากยังไม่ล็อกอินจะ redirect ไป `/login` หากไม่ใช่ ADMIN จะ redirect ไป `/unauthorized`
* **`/unauthorized`:** แสดงหน้าแจ้งเตือน 🚫 **"ไม่มีสิทธิ์เข้าถึง"** พร้อมปุ่มพากลับสู่ Dashboard หรือหน้าแรก

### 4. ระบบสมัครสมาชิก (Sign Up & Validation)
* ตรวจสอบการกรอกข้อมูลครบทุกช่อง (Name, Email, Password, Confirm Password)
* ตรวจสอบรูปแบบอีเมลด้วย Regular Expression (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
* ตรวจสอบความยาวรหัสผ่านไม่น้อยกว่า 6 ตัวอักษร
* ตรวจสอบความตรงกันของ Password และ Confirm Password
* ตรวจสอบอีเมลซ้ำในฐานข้อมูล
* แฮชรหัสผ่านด้วย `bcrypt.hash(password, 12)` ก่อนบันทึก

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
├── prisma/
│   └── schema.prisma                  # โมเดล User และ Enum Role (ADMIN, STAFF, USER)
├── app/
│   ├── layout.tsx                     # Root Layout
│   ├── page.tsx                       # หน้าแรก (Home Page)
│   ├── auth.ts                        # กำหนดค่า NextAuth (Credentials + GitHub Providers)
│   ├── lib/
│   │   └── prisma.ts                  # Prisma Client Singleton Instance
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts           # Route Handlers GET/POST สำหรับ NextAuth
│   ├── login/
│   │   └── page.tsx                   # หน้า Login ด้วย Email/Password และปุ่ม GitHub
│   ├── login-github/
│   │   └── page.tsx                   # หน้า Login สำหรับ GitHub โดยเฉพาะ (Members Only)
│   ├── signup/
│   │   ├── page.tsx                   # หน้าฟอร์มสมัครสมาชิก
│   │   └── actions.ts                 # Server Action ตรวจสอบข้อมูลและ Hash Password
│   ├── admin/
│   │   └── page.tsx                   # หน้า Admin Dashboard (RBAC Guard เฉพาะ ADMIN)
│   ├── unauthorized/
│   │   └── page.tsx                   # หน้าแสดงผลเมื่อไม่มีสิทธิ์เข้าถึง (🚫)
│   └── dashboard/
│       └── page.tsx                   # หน้าแสดงข้อมูลผู้ใช้งานทั่วไป
├── src/                               # แอปพลิเคชัน Interactive Live Demo สำหรับทดสอบทันที
├── .env.example                       # ตัวอย่างการตั้งค่า Environment Variables
└── README.md                          # เอกสารคู่มือการติดตั้งและการใช้งาน
```

---

## 📋 ข้อมูลบัญชีผู้ใช้สำหรับทดสอบ (Demo Accounts)

อาจารย์หรือผู้ตรวจงานสามารถใช้บัญชีเริ่มต้นเหล่านี้เพื่อทดสอบการทำงานของระบบ RBAC ได้ทันที:

| บทบาท (Role) | อีเมล (Email) | รหัสผ่าน (Password) | สิทธิ์การเข้าถึงหน้า `/admin` |
| :--- | :--- | :--- | :--- |
| **👑 ADMIN** | `admin@example.com` | `admin123` | ✅ **เข้าได้** (แสดง Admin Dashboard) |
| **💼 STAFF** | `staff@example.com` | `staff123` | 🚫 **เข้าไม่ได้** (ถูก Redirect ไปยัง `/unauthorized`) |
| **👤 USER** | `user@example.com` | `user123` | 🚫 **เข้าไม่ได้** (ถูก Redirect ไปยัง `/unauthorized`) |

---

## 🛠️ สิ่งที่ต้องเตรียมก่อนเริ่มใช้งาน (Prerequisites)

1. **Node.js** (เวอร์ชัน 20.19.0 ขึ้นไป หรือ 22.12.0 ขึ้นไป)
2. **Git** และโปรแกรม **GitHub Desktop** ([ดาวน์โหลดได้ที่ desktop.github.com](https://desktop.github.com/))
3. บัญชี [GitHub.com](https://github.com/) สำหรับสร้าง OAuth App

---

## ⚙️ ขั้นตอนการติดตั้งและรันโปรเจกต์ (Installation Guide)

### ขั้นตอนที่ 1: Clone หรือแตกไฟล์โปรเจกต์
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### ขั้นตอนที่ 2: ติดตั้ง Dependencies
```bash
npm install
```

แพ็กเกจ Prisma CLI และ Prisma Client รวมอยู่ใน `package.json` แล้ว จึงไม่ต้องติดตั้งแยก

> **Windows:** ตั้งชื่อโฟลเดอร์โปรเจกต์โดยไม่มี `&` เช่น `it-nkc-auth-rbac-system` เพื่อให้ `npx` เรียก local command ได้ถูกต้อง

### ขั้นตอนที่ 3: ตั้งค่า Environment Variables (`.env`)
คัดลอกไฟล์ `.env.example` ไปเป็น `.env`:
```bash
cp .env.example .env
```

จากนั้นแก้ไขข้อมูลในไฟล์ `.env`:
```env
# สร้าง AUTH_SECRET ได้ด้วยคำสั่ง: npx auth secret
AUTH_SECRET="your-generated-auth-secret"

# ข้อมูลจาก GitHub OAuth App (ดูวิธีสร้างในหัวข้อถัดไป)
AUTH_GITHUB_ID="your_github_client_id"
AUTH_GITHUB_SECRET="your_github_client_secret"

# URL เชื่อมต่อฐานข้อมูล (ใช้ SQLite ในระดับ Development)
DATABASE_URL="file:./dev.db"

# Base Application URL
NEXTAUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
```

### ขั้นตอนที่ 4: รัน Prisma Database Migration
```bash
# สั่งสร้างตารางและรัน Migration
npx prisma migrate dev --name auth_user

# สั่งสร้าง Prisma Client
npx prisma generate
```

### ขั้นตอนที่ 5: เริ่มต้นการทำงาน (Start Development Server)
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่: **[http://localhost:3000](http://localhost:3000)**

---

## 🐙 วิธีการสร้าง GitHub OAuth App บน GitHub.com

เพื่อเปิดใช้งานการเข้าสู่ระบบด้วย GitHub ตามโจทย์ ให้ปฏิบัติตามขั้นตอนนี้:

1. เข้าสู่ระบบที่ [https://github.com](https://github.com)
2. ไปที่รูปโปรไฟล์มุมขวาบน ➔ **Settings**
3. เลื่อนลงไปเมนูด้านซ้ายล่างสุด คลิก **Developer settings**
4. เลือกแท็บ **OAuth Apps** ➔ กดปุ่ม **New OAuth App**
5. กรอกรายละเอียดดังนี้:
   * **Application name:** `Next.js RBAC Demo` (หรือชื่อโปรเจกต์ของคุณ)
   * **Homepage URL:** `http://localhost:3000`
   * **Application description:** `Authentication and RBAC Demo for IT-NKC`
   * **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
6. กดปุ่ม **Register application**
7. คัดลอก **Client ID** นำไปวางที่ `AUTH_GITHUB_ID` ในไฟล์ `.env`
8. กดปุ่ม **Generate a new client secret** แล้วคัดลอก Secret นำไปวางที่ `AUTH_GITHUB_SECRET` ในไฟล์ `.env`

---

## 🚀 คู่มือการส่งงานขึ้น GitHub ผ่าน GitHub Desktop (Step-by-Step)

สำหรับผู้เรียนที่ต้องการส่งงานขึ้น **GitHub.com** ผ่านโปรแกรม **GitHub Desktop**:

```text
[โฟลเดอร์โปรเจกต์] ➔ [GitHub Desktop] ➔ [Commit Changes] ➔ [Publish Repository] ➔ [GitHub.com]
```

### ขั้นตอนที่ 1: เพิ่มโฟลเดอร์เข้าสู่ GitHub Desktop
1. เปิดโปรแกรม **GitHub Desktop**
2. ไปที่แถบเมนูด้านบน เลือก **File** > **Add Local Repository...** (หรือกด `Ctrl + O` / `Cmd + O`)
3. กดปุ่ม **Choose...** แล้วเลือกโฟลเดอร์ของโปรเจกต์นี้
4. หากโปรแกรมแจ้งว่า *“This directory does not appear to be a Git repository”* ให้คลิกลิงก์ **Create a repository here** เพื่อให้ GitHub Desktop เริ่มต้น Git ให้โดยอัตโนมัติ

### ขั้นตอนที่ 2: ตรวจสอบไฟล์และการบันทึก (Commit)
1. ดูที่แถบด้านซ้าย ในส่วน **Changes** จะแสดงรายการไฟล์ทั้งหมดที่เพิ่มเข้ามา เช่น `README.md`, `prisma/schema.prisma`, `app/auth.ts`, ฯลฯ
2. ที่ช่อง **Summary** ด้านล่างซ้าย ให้พิมพ์ข้อความ Commit เช่น:
   ```text
   feat: complete authentication and rbac system with full documentation
   ```
3. กดปุ่มสีฟ้า **Commit to main**

### ขั้นตอนที่ 3: อัปโหลดขึ้น GitHub (Publish Repository)
1. กดปุ่ม **Publish repository** ที่แถบเมนูด้านบน
2. ตั้งชื่อ Repository เช่น: `it-nkc-auth` หรือ `auth-rbac-assignment`
3. **สำคัญ:** หากต้องการส่งอาจารย์ ให้ **ติ๊กเอาเครื่องหมายถูกออกจาก "Keep this code private"** เพื่อให้คลังโค้ดเป็นสาธารณะ (Public) หรือปฏิบัติตามข้อกำหนดของรายวิชา
4. กดปุ่ม **Publish Repository**

### ขั้นตอนที่ 4: คัดลอก URL เพื่อส่งงาน
1. ใน GitHub Desktop ไปที่เมนู **Repository** > **View on GitHub**
2. ตรวจสอบว่าหน้าคลังโค้ดมีไฟล์ครบถ้วน และมีไฟล์ `README.md` แสดงผลอย่างเรียบร้อย
3. คัดลอก URL ของ Repository (เช่น `https://github.com/your-username/it-nkc-auth`) ส่งในระบบส่งงานของอาจารย์ผู้สอน

---

## 🧪 ขั้นตอนการทดสอบระบบ (Verification Walkthrough)

1. **ทดสอบการสมัครสมาชิก (Sign Up):**
   * ไปที่หน้า `/signup`
   * ทดลองกรอกรหัสผ่านไม่ตรงกัน หรืออีเมลผิดรูปแบบ เพื่อดูการแจ้งเตือน Error
   * กรอกข้อมูลที่ถูกต้องและกด "สร้างบัญชี" ระบบจะพาไปยังหน้า `/login` พร้อมข้อความแจ้งเตือนสำเร็จ
2. **ทดสอบการล็อกอินเป็น ADMIN:**
   * ล็อกอินด้วย `admin@example.com` / `admin123`
   * ระบบจะอนุญาตให้เข้าใช้งานหน้า `/admin` ได้อย่างถูกต้อง
3. **ทดสอบการป้องกันสิทธิ์ (RBAC Blocking):**
   * ออกจากระบบ แล้วล็อกอินด้วย `user@example.com` / `user123` (หรือ `staff@example.com` / `staff123`)
   * พยายามเข้าถึง URL `/admin`
   * ระบบจะทำการ redirect ผู้ใช้ไปยังหน้า `/unauthorized` (🚫 ไม่มีสิทธิ์เข้าถึง) โดยอัตโนมัติ
4. **ทดสอบ GitHub OAuth:**
   * กดปุ่ม "Sign in with Github"
   * ตรวจสอบว่าระบบสร้างเซสชันและมอบ Role `USER` ให้โดยอัตโนมัติ

---

## 📄 License
โครงงานนี้พัฒนาขึ้นเพื่อการศึกษาตามหลักสูตรของมหาวิทยาลัยขอนแก่น วิทยาเขตหนองคาย (IT-NKC)
