"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Camera, CheckCircle2, MapPin, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthFormField, authInputClassName } from "@/components/sections/auth/auth-form-field";
import { OtpCodeInput } from "@/components/sections/auth/otp-code-input";
import { useAuth } from "@/components/providers/auth-provider";
import { sendPhoneOtp, verifyPhoneOtp } from "@/lib/auth/api";
import { completeOnboarding, updateProfile, uploadAvatar } from "@/lib/account/api";
import type { UserPreferences } from "@/types/auth";
import { cn } from "@/lib/utils";

const PHONE_OTP_COOLDOWN_SECONDS = 60;

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];

const steps = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Address", icon: MapPin },
  { id: 3, label: "Preferences", icon: Sparkles },
  { id: 4, label: "Photo", icon: Camera },
  { id: 5, label: "Done", icon: CheckCircle2 },
];

export function OnboardingFlow() {
  const router = useRouter();
  const { user, refreshSession } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(Boolean(user?.phone_verified && user?.phone));
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneCooldown, setPhoneCooldown] = useState(0);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [address, setAddress] = useState({
    label: "Home" as const,
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "Haryana",
    pincode: "",
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: "system",
    language: "en",
    currency: "USD",
    marketing_emails: false,
    order_notifications: true,
    wishlist_alerts: true,
    price_alerts: false,
    back_in_stock_alerts: true,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const timer = window.setTimeout(() => setPhoneCooldown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [phoneCooldown]);

  if (!user) return null;

  function handlePhoneChange(value: string) {
    setPhone(value);
    setPhoneVerified(false);
    setPhoneOtpSent(false);
    setPhoneOtp("");
    setAddress((current) => ({ ...current, phone: value }));
  }

  async function handleSendPhoneOtp() {
    if (!phone.trim()) {
      setError("Enter your phone number first.");
      return;
    }

    setError(null);
    setIsSendingPhoneOtp(true);

    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() });
      await sendPhoneOtp(phone.trim());
      setPhoneOtpSent(true);
      setPhoneCooldown(PHONE_OTP_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send phone code.");
    } finally {
      setIsSendingPhoneOtp(false);
    }
  }

  async function handleVerifyPhone() {
    if (phoneOtp.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setError(null);
    setIsVerifyingPhone(true);

    try {
      await verifyPhoneOtp(phoneOtp);
      setPhoneVerified(true);
      await refreshSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify phone number.");
    } finally {
      setIsVerifyingPhone(false);
    }
  }

  async function handleFinish() {
    setError(null);
    setIsSaving(true);
    try {
      await completeOnboarding({
        name: name.trim(),
        phone: phone.trim(),
        address: { ...address, name: name.trim(), phone: phone.trim() },
        preferences,
        profile_completed: true,
      });

      if (avatarFile) {
        try {
          await uploadAvatar(avatarFile);
        } catch (avatarErr) {
          console.error(avatarErr);
          setError(
            "Profile saved, but photo upload failed. You can add it later from Edit Profile."
          );
          await refreshSession();
          setStep(5);
          return;
        }
      }

      await refreshSession();
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete onboarding");
    } finally {
      setIsSaving(false);
    }
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError(null);
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-10 pt-28">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Welcome</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Set up your Chic A Boo account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Step {step} of 5</p>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          {steps.map((s) => (
            <div
              key={s.id}
              className={cn(
                "h-2 w-8 rounded-full transition-colors",
                s.id <= step ? "bg-primary" : "bg-secondary"
              )}
            />
          ))}
        </div>

        {error ? (
          <p className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="rounded-2xl border border-border/30 bg-white p-5 shadow-md"
          >
            {step === 1 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Personal information</h2>
                <AuthFormField label="Full name" id="onb-name">
                  <input id="onb-name" className={authInputClassName} value={name} onChange={(e) => setName(e.target.value)} />
                </AuthFormField>
                <AuthFormField label="Phone number" id="onb-phone">
                  <input
                    id="onb-phone"
                    className={authInputClassName}
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+91 98765 43210"
                    disabled={isVerifyingPhone}
                  />
                </AuthFormField>

                {phoneVerified ? (
                  <p className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
                    <CheckCircle2 size={16} className="text-primary" />
                    Phone number verified
                  </p>
                ) : (
                  <div className="space-y-3 rounded-xl border border-border/20 bg-secondary/20 p-4">
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll send a one-time code to verify your number.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-full rounded-full"
                      onClick={handleSendPhoneOtp}
                      disabled={isSendingPhoneOtp || !phone.trim() || phoneCooldown > 0}
                    >
                      {isSendingPhoneOtp
                        ? "Sending code..."
                        : phoneCooldown > 0
                          ? `Resend code in ${phoneCooldown}s`
                          : phoneOtpSent
                            ? "Resend code"
                            : "Send verification code"}
                    </Button>

                    {phoneOtpSent ? (
                      <>
                        <AuthFormField label="Phone verification code" id="onb-phone-otp">
                          <OtpCodeInput
                            id="onb-phone-otp"
                            value={phoneOtp}
                            onChange={setPhoneOtp}
                            disabled={isVerifyingPhone}
                          />
                        </AuthFormField>
                        <Button
                          type="button"
                          className="h-10 w-full rounded-full"
                          onClick={handleVerifyPhone}
                          disabled={isVerifyingPhone || phoneOtp.length !== 6}
                        >
                          {isVerifyingPhone ? "Verifying..." : "Verify phone"}
                        </Button>
                      </>
                    ) : null}
                  </div>
                )}

                <Button
                  type="button"
                  className="h-11 w-full rounded-full"
                  onClick={() => setStep(2)}
                  disabled={!name.trim() || !phone.trim() || !phoneVerified}
                >
                  Continue
                </Button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Default delivery address</h2>
                <AuthFormField label="Label" id="onb-label">
                  <select id="onb-label" className={authInputClassName} value={address.label} onChange={(e) => setAddress({ ...address, label: e.target.value as "Home" })}>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </AuthFormField>
                <AuthFormField label="Address line 1" id="onb-line1">
                  <input id="onb-line1" className={authInputClassName} value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                </AuthFormField>
                <AuthFormField label="Address line 2" id="onb-line2">
                  <input id="onb-line2" className={authInputClassName} value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
                </AuthFormField>
                <div className="grid grid-cols-2 gap-3">
                  <AuthFormField label="City" id="onb-city">
                    <input id="onb-city" className={authInputClassName} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  </AuthFormField>
                  <AuthFormField label="Pincode" id="onb-pin">
                    <input id="onb-pin" className={authInputClassName} value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} maxLength={6} />
                  </AuthFormField>
                </div>
                <AuthFormField label="State" id="onb-state">
                  <select id="onb-state" className={authInputClassName} value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </AuthFormField>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="h-11 flex-1 rounded-full" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" className="h-11 flex-1 rounded-full" onClick={() => setStep(3)} disabled={!address.line1 || !address.city || !address.pincode}>Continue</Button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Shopping preferences</h2>
                <AuthFormField label="Language" id="onb-lang">
                  <select id="onb-lang" className={authInputClassName} value={preferences.language} onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </AuthFormField>
                <AuthFormField label="Currency" id="onb-currency">
                  <select id="onb-currency" className={authInputClassName} value={preferences.currency} onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}>
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </AuthFormField>
                {[
                  ["marketing_emails", "Marketing emails"],
                  ["price_alerts", "Price drop alerts"],
                  ["wishlist_alerts", "Wishlist alerts"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between rounded-xl border border-border/20 px-4 py-3">
                    <span className="text-sm">{label}</span>
                    <input
                      type="checkbox"
                      checked={preferences[key as keyof UserPreferences] as boolean}
                      onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                    />
                  </label>
                ))}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="h-11 flex-1 rounded-full" onClick={() => setStep(2)}>Back</Button>
                  <Button type="button" className="h-11 flex-1 rounded-full" onClick={() => setStep(4)}>Continue</Button>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-4 text-center">
                <h2 className="text-lg font-semibold">Profile photo (optional)</h2>
                <label className="mx-auto flex size-28 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-secondary/60">
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt="" width={112} height={112} className="size-full object-cover" unoptimized />
                  ) : (
                    <Camera className="text-muted-foreground" />
                  )}
                  <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
                </label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="h-11 flex-1 rounded-full" onClick={() => setStep(3)}>Back</Button>
                  <Button type="button" className="h-11 flex-1 rounded-full" onClick={handleFinish} disabled={isSaving}>
                    {isSaving ? "Saving…" : avatarFile ? "Finish setup" : "Skip & finish"}
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-4 py-6 text-center">
                <CheckCircle2 className="mx-auto text-primary" size={48} />
                <h2 className="text-xl font-semibold">You&apos;re all set!</h2>
                <p className="text-sm text-muted-foreground">Your Chic A Boo account is ready for bespoke memories.</p>
                <Button type="button" className="h-11 w-full rounded-full" onClick={() => router.replace("/account")}>
                  Go to My Account
                </Button>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
