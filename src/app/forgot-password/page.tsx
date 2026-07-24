import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordSection } from "@/components/sections/auth/forgot-password";

export const metadata: Metadata = {
  title: "Forgot Password | Chic A Boo",
  description: "Request a password reset code for your Chic A Boo account.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordSection />
    </Suspense>
  );
}
