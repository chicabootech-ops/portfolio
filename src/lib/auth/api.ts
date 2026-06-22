import type { LoginCredentials, SignupCredentials } from "@/types/auth";
import { authService } from "@/services/auth.service";

export function loginUser(credentials: LoginCredentials) {
  return authService.login(credentials);
}

export function registerUser(credentials: SignupCredentials) {
  return authService.register(credentials);
}

export function forgotPassword(email: string) {
  return authService.forgotPassword(email);
}

export function resetPassword(payload: { token: string; new_password: string }) {
  return authService.resetPassword(payload);
}

export function verifyEmail(payload: { email: string; otp: string }) {
  return authService.verifyEmail(payload);
}

export async function resendVerificationEmail(email: string) {
  // UserService has no resend endpoint — re-trigger is not supported; user must use original OTP.
  void email;
  throw new Error("Please use the verification code already sent to your email.");
}

export function sendPhoneOtp(_phone?: string) {
  throw new Error("Phone verification is not available yet.");
}

export function verifyPhoneOtp(_otp: string) {
  throw new Error("Phone verification is not available yet.");
}
