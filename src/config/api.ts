export const apiConfig = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:8000",
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    verifyEmail: "/api/auth/verify-email",
    resendVerification: "/api/auth/resend-verification",
  },
} as const;
