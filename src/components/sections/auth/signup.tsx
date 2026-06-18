"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { registerUser } from "@/lib/auth/api";
import { AuthLayout } from "./auth-layout";
import { AuthFormField, authInputClassName } from "./auth-form-field";

const MIN_PASSWORD_LENGTH = 10;

export function SignupSection() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

    setIsSubmitting(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      await refreshSession();
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create your account."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Join Us"
      breadcrumbLabel="Create Account"
      subtitle="Create an account to save favourites, track orders, and customise gifts."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthFormField id="signup-name" label="Full Name">
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            maxLength={100}
            className={authInputClassName}
          />
        </AuthFormField>

        <AuthFormField id="signup-email" label="Email">
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={authInputClassName}
          />
        </AuthFormField>

        <AuthFormField
          id="signup-password"
          label="Password"
          error={
            password.length > 0 && password.length < MIN_PASSWORD_LENGTH
              ? `At least ${MIN_PASSWORD_LENGTH} characters required`
              : undefined
          }
        >
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a secure password"
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

        <AuthFormField id="signup-confirm-password" label="Confirm Password">
          <input
            id="signup-confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Re-enter your password"
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          By creating an account, you agree to receive order updates and
          occasional offers from Chic A Boo.
        </p>
      </form>
    </AuthLayout>
  );
}
