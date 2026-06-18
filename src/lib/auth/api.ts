import type { AuthSessionResponse, LoginCredentials, SignupCredentials } from "@/types/auth";

type ApiErrorBody = {
  error?: string;
};

async function postAuth<TBody extends object>(
  path: string,
  body: TBody,
  fallbackError: string
): Promise<AuthSessionResponse> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "same-origin",
  });

  const data = (await response.json().catch(() => ({}))) as
    | AuthSessionResponse
    | ApiErrorBody;

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "error" in data && data.error
        ? data.error
        : fallbackError;
    throw new Error(message);
  }

  return data as AuthSessionResponse;
}

async function postAuthAction<TBody extends object>(
  path: string,
  body: TBody | undefined,
  fallbackError: string
): Promise<void> {
  const response = await fetch(path, {
    method: "POST",
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  if (response.status === 204) {
    return;
  }

  const data = (await response.json().catch(() => ({}))) as ApiErrorBody;
  throw new Error(data.error ?? fallbackError);
}

export function loginUser(credentials: LoginCredentials) {
  return postAuth("/api/auth/login", credentials, "Unable to sign in.");
}

export function registerUser(credentials: SignupCredentials) {
  return postAuth(
    "/api/auth/register",
    credentials,
    "Unable to create your account."
  );
}

export function forgotPassword(email: string) {
  return postAuthAction(
    "/api/auth/forgot-password",
    { email: email.trim() },
    "Unable to send reset code."
  );
}

export function resetPassword(payload: {
  email: string;
  otp: string;
  new_password: string;
}) {
  return postAuthAction(
    "/api/auth/reset-password",
    {
      email: payload.email.trim(),
      otp: payload.otp,
      new_password: payload.new_password,
    },
    "Unable to reset password."
  );
}

export function verifyEmail(payload: { email: string; otp: string }) {
  return postAuthAction(
    "/api/auth/verify-email",
    {
      email: payload.email.trim(),
      otp: payload.otp,
    },
    "Unable to verify email."
  );
}

export function resendVerificationEmail() {
  return postAuthAction(
    "/api/auth/resend-verification",
    undefined,
    "Unable to resend verification code."
  );
}

export function sendPhoneOtp(phone?: string) {
  return postAuthAction(
    "/api/user/phone/send-otp",
    phone?.trim() ? { phone: phone.trim() } : undefined,
    "Unable to send phone code."
  );
}

export function verifyPhoneOtp(otp: string) {
  return postAuthAction(
    "/api/user/phone/verify",
    { otp },
    "Unable to verify phone number."
  );
}
