"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userQueryKeys } from "@/hooks/query-keys";
import { loginUser } from "@/lib/auth/api";
import { AuthLayout } from "./auth-layout";
import { AuthFormField, authInputClassName } from "./auth-form-field";

function safeNextPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export function LoginSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const nextPath = safeNextPath(searchParams.get("next"));
  const resetOk = searchParams.get("reset") === "1";
  const verifiedOk = searchParams.get("verified") === "1";
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { user: sessionUser } = await loginUser({
        email: email.trim(),
        password,
      });
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });

      if (!sessionUser.is_verified) {
        const verifyQs = new URLSearchParams({ email: sessionUser.email });
        if (nextPath) verifyQs.set("next", nextPath);
        router.push(`/verify-email?${verifyQs.toString()}`);
      } else if (!sessionUser.profile_completed) {
        router.push(
          nextPath ? `/onboarding?next=${encodeURIComponent(nextPath)}` : "/onboarding"
        );
      } else {
        router.push(nextPath ?? "/");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      breadcrumbLabel="Sign In"
      subtitle="Sign in to manage orders, wishlists, and your bespoke preferences."
      footer={
        <>
          New to Chic A Boo?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {resetOk ? (
          <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
            Password updated. Sign in with your new password.
          </p>
        ) : null}
        {verifiedOk ? (
          <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
            Email verified. Sign in to continue.
          </p>
        ) : null}

        <AuthFormField id="login-email" label="Email">
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={authInputClassName}
          />
        </AuthFormField>

        <AuthFormField id="login-password" label="Password">
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
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

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary hover:underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>

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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
