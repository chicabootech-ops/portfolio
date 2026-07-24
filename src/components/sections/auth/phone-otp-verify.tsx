"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendPhoneOtp, verifyPhoneOtp } from "@/lib/auth/api";
import { AuthFormField, authInputClassName } from "@/components/sections/auth/auth-form-field";

/** Normalize to 10-digit Indian mobile or null if invalid / empty. */
export function normalizeIndianMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  let national = digits;
  if (national.startsWith("91") && national.length === 12) {
    national = national.slice(2);
  }
  if (national.startsWith("0") && national.length === 11) {
    national = national.slice(1);
  }
  if (!/^[6-9]\d{9}$/.test(national)) return null;
  return national;
}

type PhoneOtpVerifyProps = {
  phone: string;
  onPhoneChange: (value: string) => void;
  onVerified: () => void | Promise<void>;
  /** When true, phone field is read-only (OTP already in flight). */
  disabled?: boolean;
  optionalHint?: boolean;
};

export function PhoneOtpVerify({
  phone,
  onPhoneChange,
  onVerified,
  disabled,
  optionalHint = false,
}: PhoneOtpVerifyProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSendOtp() {
    setError(null);
    setMessage(null);
    const national = normalizeIndianMobile(phone);
    if (!national) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setBusy(true);
    try {
      await sendPhoneOtp(national);
      setOtpSent(true);
      setOtp("");
      setMessage("OTP sent by SMS. Enter the code below.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify() {
    setError(null);
    setMessage(null);
    if (otp.trim().length < 4) {
      setError("Enter the OTP from your SMS.");
      return;
    }
    setBusy(true);
    try {
      await verifyPhoneOtp(otp.trim());
      setMessage("Phone verified.");
      await onVerified();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify OTP.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <AuthFormField
        label={optionalHint ? "Phone number (optional)" : "Phone number"}
        id="phone-otp-number"
      >
        <input
          id="phone-otp-number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          className={authInputClassName}
          value={phone}
          disabled={disabled || busy || otpSent}
          onChange={(e) => {
            onPhoneChange(e.target.value);
            setOtpSent(false);
            setOtp("");
            setMessage(null);
            setError(null);
          }}
          placeholder="10-digit Indian mobile"
        />
      </AuthFormField>

      {!otpSent ? (
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-full"
          disabled={disabled || busy || !phone.trim()}
          onClick={handleSendOtp}
        >
          {busy ? <Loader2 className="animate-spin" size={16} /> : null}
          {busy ? "Sending OTP…" : "Send OTP"}
        </Button>
      ) : (
        <div className="space-y-3">
          <AuthFormField label="SMS OTP" id="phone-otp-code">
            <input
              id="phone-otp-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              disabled={busy}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="Enter OTP"
              className={`${authInputClassName} text-center text-lg tracking-[0.35em]`}
            />
          </AuthFormField>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="h-11 flex-1 rounded-full"
              disabled={busy || otp.trim().length < 4}
              onClick={handleVerify}
            >
              {busy ? <Loader2 className="animate-spin" size={16} /> : null}
              Verify phone
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-full"
              disabled={busy}
              onClick={handleSendOtp}
            >
              Resend OTP
            </Button>
          </div>
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
            disabled={busy}
            onClick={() => {
              setOtpSent(false);
              setOtp("");
              setMessage(null);
              setError(null);
            }}
          >
            Change number
          </button>
        </div>
      )}

      {message ? (
        <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
