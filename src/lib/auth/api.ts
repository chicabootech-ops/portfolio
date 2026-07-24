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

export function resendVerificationEmail(email: string) {
  return authService.resendVerification(email);
}

export function sendPhoneOtp(phone?: string) {
  return authService.sendPhoneOtp(phone);
}

export function verifyPhoneOtp(otp: string) {
  return authService.verifyPhoneOtp(otp);
}
