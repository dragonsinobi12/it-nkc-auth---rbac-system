// src/lib/authStore.ts
import bcrypt from "bcryptjs";
import { User, Session, Role } from "../types";

const USERS_STORAGE_KEY = "it_nkc_auth_users_v1";
const SESSION_STORAGE_KEY = "it_nkc_auth_session_v1";

// Pre-seeded hashed passwords (bcrypt salt rounds = 10)
// admin123 -> $2a$10$wI5F0L/xN7o7yG/KkQpP0eWqX7aU8l.Lp2A4eN8z7gQ2yZ0gB.Q6.
// staff123 -> $2a$10$sQj9u3p9j1u1q0r8.2.7.eK9w0yX8aU8l.Lp2A4eN8z7gQ2yZ0gB.Q
// user123  -> $2a$10$wF9u1p9j1u1q0r8.2.7.eK9w0yX8aU8l.Lp2A4eN8z7gQ2yZ0gB.Q

const INITIAL_USERS: User[] = [
  {
    id: "usr_admin_001",
    name: "System Admin",
    email: "admin@example.com",
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "ADMIN",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
    provider: "credentials",
  },
  {
    id: "usr_staff_002",
    name: "Faculty Staff",
    email: "staff@example.com",
    passwordHash: bcrypt.hashSync("staff123", 10),
    role: "STAFF",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    provider: "credentials",
  },
  {
    id: "usr_user_003",
    name: "Student Member",
    email: "user@example.com",
    passwordHash: bcrypt.hashSync("user123", 10),
    role: "USER",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    provider: "credentials",
  },
];

export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: User[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users", err);
  }
}

export function getSession(): Session | null {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null) {
  try {
    if (!session) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.error("Failed to save session", err);
  }
}

export function resetDatabase() {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  saveSession(null);
}

// Credentials Authorize logic matching NextAuth & prisma
export async function authenticateCredentials(
  email: string,
  password: string,
): Promise<{ user?: User; error?: string }> {
  if (!email || !password) {
    return { error: "กรุณากรอก Email และ Password ให้ครบถ้วน" };
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!user) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  return { user };
}

// Signup logic matching app/signup/actions.ts
export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<{ success?: boolean; error?: string }> {
  const { name, email, password, confirmPassword } = formData;

  if (!name.trim() || !email.trim() || !password || !confirmPassword) {
    return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" };
  }

  if (password !== confirmPassword) {
    return { error: "รหัสผ่านไม่ตรงกัน" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { error: "รูปแบบ Email ไม่ถูกต้อง" };
  }

  const users = getUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (exists) {
    return { error: "Email นี้ถูกใช้งานแล้ว" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    role: "USER", // Default role is USER as per specification
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    provider: "credentials",
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true };
}

// GitHub OAuth simulation matching GitHub callback in NextAuth
export function authenticateWithGithub(githubProfile?: {
  login: string;
  name?: string;
  email?: string;
  avatar_url?: string;
}): Session {
  const login = githubProfile?.login || "github-developer";
  const name = githubProfile?.name || login;
  const email = githubProfile?.email || `${login}@users.noreply.github.com`;
  const avatarUrl =
    githubProfile?.avatar_url ||
    `https://avatars.githubusercontent.com/u/9919?v=4`;

  const users = getUsers();
  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: `gh_${Date.now()}`,
      name,
      email,
      passwordHash: "",
      role: "USER", // Assignment rule: GitHub users default to "USER"
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatarUrl,
      provider: "github",
    };
    users.push(user);
    saveUsers(users);
  }

  const session: Session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl,
      provider: "github",
    },
    expires: new Date(Date.now() + 86400000 * 7).toISOString(),
  };

  saveSession(session);
  return session;
}

export function updateUserRole(userId: string, newRole: Role): boolean {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return false;

  users[index].role = newRole;
  users[index].updatedAt = new Date().toISOString();
  saveUsers(users);

  // If current session is this user, update session as well
  const currentSession = getSession();
  if (currentSession && currentSession.user.id === userId) {
    currentSession.user.role = newRole;
    saveSession(currentSession);
  }

  return true;
}
