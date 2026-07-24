"use client";

import { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLogoutAll } from "@/hooks/useSecurity";
import type { SecurityStatus } from "@/types/account";
import { SectionCard } from "./shared/section-card";

type SecurityCenterProps = {
  status: SecurityStatus;
  phone?: string | null;
  email?: string;
  onVerified?: () => void;
};

function StatusItem({
  icon,
  label,
  ok,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-background/50 px-3 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <Badge variant={ok ? "success" : "warning"}>
        {ok ? "Active" : "Action needed"}
      </Badge>
    </div>
  );
}

export function SecurityCenter({ status, phone, email }: SecurityCenterProps) {
  const logoutAll = useLogoutAll();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRevokeOthers() {
    setMessage(null);
    setError(null);
    try {
      await logoutAll.mutateAsync();
      setMessage("Other sessions have been signed out.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not revoke sessions");
    }
  }

  return (
    <SectionCard title="Security Center">
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <ShieldCheck className="shrink-0 text-primary" size={28} aria-hidden />
        <div>
          <p className="font-medium text-foreground">Your account is protected</p>
          <p className="text-sm text-muted-foreground">
            {status.active_sessions} active session
            {status.active_sessions !== 1 ? "s" : ""} on your account
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <StatusItem
          icon={<Mail size={16} />}
          label="Email verification"
          ok={status.email_verified}
          detail={status.email_verified ? "Verified and secure" : "Verify your email"}
        />
        {!status.email_verified ? (
          <div className="rounded-xl border border-border/30 bg-background/50 p-4">
            <p className="mb-3 text-sm text-muted-foreground">
              Check your inbox for the code sent at signup.
            </p>
            <Button type="button" asChild className="h-10 rounded-full">
              <Link href={`/verify-email${email ? `?email=${encodeURIComponent(email)}` : ""}`}>
                Enter code
              </Link>
            </Button>
          </div>
        ) : null}
        <StatusItem
          icon={<Phone size={16} />}
          label="Phone number"
          ok={Boolean(phone)}
          detail={phone ? phone : "Add a phone number in Edit Profile"}
        />
        <StatusItem
          icon={<KeyRound size={16} />}
          label="Password"
          ok={status.password_set}
          detail={status.password_set ? "Strong password set" : "Create a password"}
        />
        <StatusItem
          icon={<Smartphone size={16} />}
          label="Two-factor authentication"
          ok={status.two_factor_enabled}
          detail={
            status.two_factor_enabled
              ? "2FA is enabled"
              : "Coming soon"
          }
        />
      </div>

      {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 min-h-[44px] rounded-full"
          disabled={logoutAll.isPending}
          onClick={handleRevokeOthers}
        >
          <LogOut size={16} aria-hidden />
          {logoutAll.isPending ? "Signing out…" : "Logout other devices"}
        </Button>
      </div>
    </SectionCard>
  );
}
