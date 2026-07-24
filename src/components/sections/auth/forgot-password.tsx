"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/lib/auth/api";
import { AuthLayout } from "./auth-layout";
import { AuthFormField, authInputClassName } from "./auth-form-field";

export function ForgotPasswordSection() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      breadcrumbLabel="Forgot Password"
      subtitle="Enter your email and we will send a secure reset link."
      footer={
        <>
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </>
      }
    >
      {success ? (
        <div className="space-y-5 text-center">
          <p className="text-sm text-muted-foreground">
            If an account exists for{" "}
            <span className="font-medium text-foreground">{email}</span>, we sent a
            password reset link. Open it from your inbox to choose a new password.
          </p>
          <p className="text-xs text-muted-foreground">
            The link expires after a short time. Didn’t get it? Check spam, or request
            another link below.
          </p>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-full text-sm font-semibold tracking-wide"
            onClick={() => setSuccess(false)}
          >
            Send again
          </Button>
          <Link
            href="/login"
            className="inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold tracking-wide text-primary hover:underline underline-offset-4"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthFormField id="forgot-email" label="Email">
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={authInputClassName}
            />
          </AuthFormField>

          {error ? (
            <p
              className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error}
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
                Sending link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
