"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Monitor, Smartphone, Tablet, Trash2 } from "lucide-react";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMe } from "@/hooks/useMe";
import {
  useLoginHistory,
  useLogoutAll,
  useRevokeDevice,
  useSecurityDevices,
} from "@/hooks/useSecurity";
import { sendPhoneOtp, verifyPhoneOtp } from "@/lib/auth/api";
import { authInputClassName } from "@/components/sections/auth/auth-form-field";
import { SectionCard } from "./shared/section-card";
import { AccountPageSkeleton } from "./account-page-skeleton";

function DeviceIcon({ type }: { type: string }) {
  if (type === "mobile") return <Smartphone size={18} aria-hidden />;
  if (type === "tablet") return <Tablet size={18} aria-hidden />;
  return <Monitor size={18} aria-hidden />;
}

export function SecurityPage() {
  const router = useRouter();
  const { data: me, isLoading: meLoading, refetch: refetchMe } = useMe();
  const hasSession = Boolean(me);
  const { data: devices = [], isLoading: devicesLoading } = useSecurityDevices(hasSession);
  const { data: logins } = useLoginHistory({ limit: 10 }, hasSession);
  const revokeDevice = useRevokeDevice();
  const logoutAll = useLogoutAll();

  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const phoneDisplay = useMemo(() => me?.phone ?? "", [me?.phone]);

  // Prefill saved number so existing users can tap Send OTP immediately.
  useMemo(() => {
    // no-op placeholder — real prefills below via effect pattern
  }, []);

  if (meLoading || !me) {
    if (!meLoading && !me) {
      router.replace("/login?next=/account/security");
    }
    return <AccountPageSkeleton />;
  }

  async function handleSendOtp() {
    setMessage(null);
    setError(null);
    setOtpBusy(true);
    try {
      const phone = otpPhone.trim() || undefined;
      await sendPhoneOtp(phone);
      setOtpSent(true);
      setMessage("OTP sent. Enter the code from your SMS.");
      await refetchMe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP.");
    } finally {
      setOtpBusy(false);
    }
  }

  async function handleVerifyOtp() {
    setMessage(null);
    setError(null);
    setOtpBusy(true);
    try {
      await verifyPhoneOtp(otpCode.trim());
      setMessage("Phone verified.");
      setOtpSent(false);
      setOtpCode("");
      await refetchMe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify OTP.");
    } finally {
      setOtpBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-36 md:pb-16 md:pt-40">
      <div className="mx-auto w-full max-w-3xl space-y-5 px-4 md:px-6 md:space-y-6">
        <PageBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "My Account", href: "/account" },
            { label: "Security" },
          ]}
          className="mb-2 md:mt-10"
        />

        <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Security
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage password recovery, phone verification, and active devices.
        </p>

        {message ? (
          <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
            {message}
          </p>
        ) : null}
        {error ? (
          <p
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <SectionCard title="Password" id="password">
          <p className="mb-4 text-sm text-muted-foreground">
            Change your password via a secure email link. All other sessions will be signed
            out after a successful reset.
          </p>
          <Button asChild variant="outline" className="h-11 rounded-full">
            <Link href={`/forgot-password?email=${encodeURIComponent(me.email)}`}>
              <KeyRound size={16} aria-hidden />
              Send password reset link
            </Link>
          </Button>
        </SectionCard>

        <SectionCard title="Phone verification" id="phone">
          <p className="mb-3 text-sm text-muted-foreground">
            {me.phone_verified
              ? `Verified: ${phoneDisplay || "your phone"}`
              : phoneDisplay
                ? `Saved number: ${phoneDisplay} — verify with OTP`
                : "Add a phone number, then verify with OTP."}
          </p>
          {!me.phone_verified ? (
            <div className="space-y-3">
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Indian mobile (optional if already on profile)"
                value={otpPhone}
                onChange={(e) => setOtpPhone(e.target.value)}
                className={authInputClassName}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="h-11 rounded-full"
                  disabled={otpBusy}
                  onClick={handleSendOtp}
                >
                  {otpBusy && !otpSent ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : null}
                  Send OTP
                </Button>
              </div>
              {otpSent ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="Enter OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className={authInputClassName}
                  />
                  <Button
                    type="button"
                    className="h-11 shrink-0 rounded-full"
                    disabled={otpBusy || otpCode.trim().length < 4}
                    onClick={handleVerifyOtp}
                  >
                    {otpBusy ? <Loader2 className="animate-spin" size={16} /> : null}
                    Verify
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <Badge variant="success">Phone verified</Badge>
          )}
        </SectionCard>

        <SectionCard title="Devices" id="devices">
          {devicesLoading ? (
            <div className="h-24 animate-pulse rounded-xl bg-secondary/30" />
          ) : devices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No devices recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {devices.map((device) => (
                <li
                  key={device.id}
                  className="flex items-start gap-3 rounded-xl border border-border/25 bg-background/50 p-4"
                >
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/60 text-primary">
                    <DeviceIcon type={device.device_type} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">
                        {device.device_name || device.device_type || "Device"}
                      </p>
                      {device.is_current ? <Badge variant="success">This device</Badge> : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Last seen {new Date(device.last_seen_at).toLocaleString()}
                      {device.ip_address ? ` · ${device.ip_address}` : ""}
                    </p>
                  </div>
                  {!device.is_current ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      aria-label="Revoke device"
                      disabled={revokeDevice.isPending}
                      onClick={() => revokeDevice.mutate(device.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          <Button
            type="button"
            variant="outline"
            className="mt-4 h-11 w-full rounded-full"
            disabled={logoutAll.isPending}
            onClick={() => logoutAll.mutate()}
          >
            {logoutAll.isPending ? "Signing out…" : "Sign out all other devices"}
          </Button>
        </SectionCard>

        <SectionCard title="Recent login activity">
          {!logins?.items?.length ? (
            <p className="text-sm text-muted-foreground">No login history yet.</p>
          ) : (
            <ul className="space-y-2">
              {logins.items.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-background/50 px-3 py-3 text-sm"
                >
                  <span className="min-w-0 truncate text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString()}
                    {entry.ip_address ? ` · ${entry.ip_address}` : ""}
                  </span>
                  <Badge variant={entry.success ? "success" : "warning"}>
                    {entry.success ? "OK" : "Failed"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </main>
  );
}
