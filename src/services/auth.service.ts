/**
 * Auth API client — Next.js BFF routes (`/api/auth/*` → Gateway `/api/user/auth/*`).
 */

import { apiFetch } from "@/lib/api/http";
import type { AuthSessionResponse, LoginCredentials, SignupCredentials } from "@/types/auth";

export const authService = {
  login: (credentials: LoginCredentials) =>
    apiFetch<AuthSessionResponse>("/api/auth/login", {
      method: "POST",
      body: credentials,
    }),

  register: (credentials: SignupCredentials) =>
    apiFetch<{ message: string }>("/api/auth/register", {
      method: "POST",
      body: credentials,
    }),

  verifyEmail: (payload: { email: string; otp: string }) =>
    apiFetch<{ message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: payload,
    }),

  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),

  resetPassword: (payload: { token: string; new_password: string }) =>
    apiFetch<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: payload,
    }),

  logout: () =>
    apiFetch<void>("/api/auth/logout", { method: "POST" }),

  getSession: () =>
    apiFetch<AuthSessionResponse | { user: null }>("/api/auth/session"),
};
