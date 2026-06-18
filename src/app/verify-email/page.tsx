import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailSection } from "@/components/sections/auth/verify-email";

export const metadata: Metadata = {
  title: "Verify Email | Chic A Boo",
  description: "Verify your Chic A Boo account email address.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailSection />
    </Suspense>
  );
}
