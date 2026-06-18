"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/auth/api";
import { AuthLayout } from "./auth-layout";
import { AuthFormField, authInputClassName } from "./auth-form-field";
import { OtpCodeInput } from "./otp-code-input";

const MIN_PASSWORD_LENGTH = 10;

export function ResetPasswordSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        email: email.trim(),
        otp,
        new_password: password,
      });
      router.push("/login");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="New Password"
      breadcrumbLabel="Reset Password"
      subtitle="Enter the code we emailed you and choose a new password."
      footer={
        <>
          Need a new code?{" "}
          <Link
            href={`/forgot-password?email=${encodeURIComponent(email.trim())}`}
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Resend code
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthFormField id="reset-email" label="Email">
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={authInputClassName}
          />
        </AuthFormField>

        <AuthFormField id="reset-otp" label="Reset code">
          <OtpCodeInput id="reset-otp" value={otp} onChange={setOtp} disabled={isSubmitting} />
        </AuthFormField>

        <AuthFormField id="reset-password" label="New password">
          <div className="relative">
            <input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              maxLength={128}
              className={authInputClassName}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </AuthFormField>

        <AuthFormField id="reset-confirm-password" label="Confirm password">
          <input
            id="reset-confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            maxLength={128}
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
              Updating password...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
