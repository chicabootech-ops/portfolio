export const apiConfig = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:8000",
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
  },
} as const;
