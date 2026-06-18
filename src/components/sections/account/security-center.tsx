"use client";

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
import type { SecurityStatus } from "@/types/account";
import { SectionCard } from "./shared/section-card";

type SecurityCenterProps = {
  status: SecurityStatus;
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

export function SecurityCenter({ status }: SecurityCenterProps) {
  return (
    <SectionCard title="Security Center">
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <ShieldCheck className="shrink-0 text-primary" size={28} aria-hidden />
        <div>
          <p className="font-medium text-foreground">Your account is protected</p>
          <p className="text-sm text-muted-foreground">
            {status.activeSessions} active session
            {status.activeSessions !== 1 ? "s" : ""} on your account
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <StatusItem
          icon={<Mail size={16} />}
          label="Email verification"
          ok={status.emailVerified}
          detail={status.emailVerified ? "Verified and secure" : "Verify your email"}
        />
        <StatusItem
          icon={<Phone size={16} />}
          label="Phone verification"
          ok={status.phoneVerified}
          detail={status.phoneVerified ? "Verified and secure" : "Add and verify phone"}
        />
        <StatusItem
          icon={<KeyRound size={16} />}
          label="Password"
          ok={status.passwordSet}
          detail={status.passwordSet ? "Strong password set" : "Create a password"}
        />
        <StatusItem
          icon={<Smartphone size={16} />}
          label="Two-factor authentication"
          ok={status.twoFactorEnabled}
          detail={
            status.twoFactorEnabled
              ? "2FA is enabled"
              : "Add an extra layer of security"
          }
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Button
          asChild
          variant="outline"
          className="h-11 min-h-[44px] rounded-full"
        >
          <Link href="/account/security">Manage Security</Link>
        </Button>
        <Button variant="outline" className="h-11 min-h-[44px] rounded-full">
          <LogOut size={16} aria-hidden />
          Logout Other Devices
        </Button>
        <Button
          asChild
          className="h-11 min-h-[44px] rounded-full"
        >
          <Link href="/account/security#password">
            <KeyRound size={16} aria-hidden />
            Change Password
          </Link>
        </Button>
      </div>
    </SectionCard>
  );
}
