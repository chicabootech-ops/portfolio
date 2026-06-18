import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordSection } from "@/components/sections/auth/reset-password";

export const metadata: Metadata = {
  title: "Reset Password | Chic A Boo",
  description: "Reset your Chic A Boo account password with your email code.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordSection />
    </Suspense>
  );
}
