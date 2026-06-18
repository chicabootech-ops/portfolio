"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { resendVerificationEmail, verifyEmail } from "@/lib/auth/api";
import { AuthLayout } from "./auth-layout";
import { AuthFormField } from "./auth-form-field";
import { OtpCodeInput } from "./otp-code-input";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, refreshSession } = useAuth();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyEmail({ email: email.trim(), otp });
      await refreshSession();
      setMessage("Email verified successfully.");
      router.push(user?.profile_completed ? "/account" : "/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify email.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || isResending) return;

    setError(null);
    setMessage(null);
    setIsResending(true);

    try {
      await resendVerificationEmail();
      setMessage("A new verification code has been sent.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend code.");
    } finally {
      setIsResending(false);
    }
  }

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <AuthLayout
        title="Verify Email"
        breadcrumbLabel="Verify Email"
        subtitle="Sign in first, then enter the verification code we sent when you registered."
        footer={
          <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
            Sign in
          </Link>
        }
      >
        <p className="text-sm text-muted-foreground">
          Verification codes are sent automatically when you create an account.
        </p>
      </AuthLayout>
    );
  }

  if (user.is_verified) {
    return (
      <AuthLayout
        title="Email Verified"
        breadcrumbLabel="Verify Email"
        subtitle="Your email address is already verified."
        footer={
          <Link href="/account" className="font-medium text-primary hover:underline underline-offset-4">
            Go to account
          </Link>
        }
      >
        <Button
          type="button"
          className="h-11 w-full rounded-full text-sm font-semibold tracking-wide"
          onClick={() => router.push("/account")}
        >
          Continue
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify Email"
      breadcrumbLabel="Verify Email"
      subtitle="Enter the 6-digit code we sent to your inbox. Codes expire in 10 minutes."
      footer={
        <>
          Wrong account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthFormField id="verify-email-display" label="Email">
          <p className="rounded-xl border border-border/40 bg-white/60 px-4 py-3 text-sm text-foreground">
            {email}
          </p>
        </AuthFormField>

        <AuthFormField id="verify-otp" label="Verification code">
          <OtpCodeInput id="verify-otp" value={otp} onChange={setOtp} disabled={isSubmitting} />
        </AuthFormField>

        {error ? (
          <p
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
            {message}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full text-sm font-semibold tracking-wide"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify email"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isResending || cooldown > 0}
          onClick={handleResend}
          className="h-11 w-full rounded-full text-sm font-semibold tracking-wide"
        >
          {isResending
            ? "Sending..."
            : cooldown > 0
              ? `Resend code in ${cooldown}s`
              : "Resend code"}
        </Button>
      </form>
    </AuthLayout>
  );
}
