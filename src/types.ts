// src/types.ts

export type Role = "ADMIN" | "STAFF" | "USER";

export interface User {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  provider?: "credentials" | "github";
}

export interface Session {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    avatarUrl?: string;
    provider?: "credentials" | "github";
  };
  expires: string;
}

export type PageRoute =
  | "/"
  | "/login"
  | "/login-github"
  | "/signup"
  | "/admin"
  | "/unauthorized"
  | "/dashboard"
  | "/guide"
  | "/code";
