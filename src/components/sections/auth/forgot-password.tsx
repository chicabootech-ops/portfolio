"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/lib/auth/api";
import { AuthLayout } from "./auth-layout";
import { AuthFormField, authInputClassName } from "./auth-form-field";

export function ForgotPasswordSection() {
  const router = useRouter();
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
      setError(err instanceof Error ? err.message : "Unable to send reset code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      breadcrumbLabel="Forgot Password"
      subtitle="Enter your email and we will send a 6-digit code to reset your password."
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
            If an account exists for <span className="font-medium text-foreground">{email}</span>,
            we sent a reset code. It expires in 10 minutes.
          </p>
          <Button
            type="button"
            className="h-11 w-full rounded-full text-sm font-semibold tracking-wide"
            onClick={() =>
              router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`)
            }
          >
            Enter reset code
          </Button>
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
                Sending code...
              </>
            ) : (
              "Send reset code"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
