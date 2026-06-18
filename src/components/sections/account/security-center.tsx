"use client";

import { useEffect, useState } from "react";
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
import { OtpCodeInput } from "@/components/sections/auth/otp-code-input";
import { useAuth } from "@/components/providers/auth-provider";
import { resendVerificationEmail, sendPhoneOtp, verifyPhoneOtp } from "@/lib/auth/api";
import type { SecurityStatus } from "@/types/account";
import { revokeOtherSessions } from "@/lib/account/api";
import { SectionCard } from "./shared/section-card";

const RESEND_COOLDOWN_SECONDS = 60;

type SecurityCenterProps = {
  status: SecurityStatus;
  phone?: string | null;
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

export function SecurityCenter({ status, phone, onVerified }: SecurityCenterProps) {
  const { refreshSession } = useAuth();
  const [isRevoking, setIsRevoking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  useEffect(() => {
    if (emailCooldown <= 0) return;
    const timer = window.setTimeout(() => setEmailCooldown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [emailCooldown]);

  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const timer = window.setTimeout(() => setPhoneCooldown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [phoneCooldown]);

  async function handleRevokeOthers() {
    setIsRevoking(true);
    setMessage(null);
    setError(null);
    try {
      await revokeOtherSessions();
      setMessage("Other sessions have been signed out.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not revoke sessions");
    } finally {
      setIsRevoking(false);
    }
  }

  async function handleResendEmailCode() {
    if (emailCooldown > 0) return;
    setError(null);
    setMessage(null);
    try {
      await resendVerificationEmail();
      setMessage("Verification code sent to your email.");
      setEmailCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send verification code.");
    }
  }

  async function handleSendPhoneCode() {
    if (phoneCooldown > 0 || !phone) return;
    setError(null);
    setMessage(null);
    setIsSendingPhoneOtp(true);
    try {
      await sendPhoneOtp();
      setPhoneCodeSent(true);
      setMessage("Phone verification code sent.");
      setPhoneCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send phone code.");
    } finally {
      setIsSendingPhoneOtp(false);
    }
  }

  async function handleVerifyPhone() {
    if (phoneOtp.length !== 6) {
      setError("Enter the 6-digit phone code.");
      return;
    }

    setError(null);
    setMessage(null);
    setIsVerifyingPhone(true);
    try {
      await verifyPhoneOtp(phoneOtp);
      await refreshSession();
      setPhoneOtp("");
      setPhoneCodeSent(false);
      setMessage("Phone number verified.");
      onVerified?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify phone number.");
    } finally {
      setIsVerifyingPhone(false);
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
              Check your inbox for the code sent at signup, or request a new one.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full"
                disabled={emailCooldown > 0}
                onClick={handleResendEmailCode}
              >
                {emailCooldown > 0 ? `Resend in ${emailCooldown}s` : "Resend email code"}
              </Button>
              <Button type="button" asChild className="h-10 rounded-full">
                <Link href="/verify-email">Enter code</Link>
              </Button>
            </div>
          </div>
        ) : null}
        <StatusItem
          icon={<Phone size={16} />}
          label="Phone verification"
          ok={status.phone_verified}
          detail={status.phone_verified ? "Verified and secure" : "Add and verify phone"}
        />
        {!status.phone_verified && phone ? (
          <div className="rounded-xl border border-border/30 bg-background/50 p-4">
            <p className="mb-3 text-sm text-muted-foreground">
              We will send a code to {phone}. In development, the code is logged by the backend.
            </p>
            <div className="space-y-3">
              <OtpCodeInput
                id="security-phone-otp"
                value={phoneOtp}
                onChange={setPhoneOtp}
                disabled={isVerifyingPhone}
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-full"
                  disabled={isSendingPhoneOtp || phoneCooldown > 0}
                  onClick={handleSendPhoneCode}
                >
                  {isSendingPhoneOtp
                    ? "Sending..."
                    : phoneCodeSent && phoneCooldown > 0
                      ? `Resend in ${phoneCooldown}s`
                      : phoneCodeSent
                        ? "Resend code"
                        : "Send phone code"}
                </Button>
                <Button
                  type="button"
                  className="h-10 rounded-full"
                  disabled={isVerifyingPhone || phoneOtp.length !== 6}
                  onClick={handleVerifyPhone}
                >
                  {isVerifyingPhone ? "Verifying..." : "Verify phone"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
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
              : "Add an extra layer of security"
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
          disabled={isRevoking}
          onClick={handleRevokeOthers}
        >
          <LogOut size={16} aria-hidden />
          {isRevoking ? "Signing out…" : "Logout other devices"}
        </Button>
      </div>
    </SectionCard>
  );
}
