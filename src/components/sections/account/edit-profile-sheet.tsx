"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  KeyRound,
  MapPin,
  User,
} from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AuthFormField, authInputClassName } from "@/components/sections/auth/auth-form-field";
import { useAuth } from "@/components/providers/auth-provider";
import {
  setStoredAvatar,
  setStoredPhone,
  setStoredAddresses,
  updateProfileOnServer,
} from "@/lib/account/profile-storage";
import type { AccountAddress } from "@/types/account";
import type { AuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";

type TabId = "profile" | "address" | "password";

type EditProfileSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser;
  phone: string;
  avatarUrl: string | null;
  defaultAddress: AccountAddress | null;
  onSaved: (data: {
    name: string;
    phone: string;
    avatarUrl: string | null;
    addresses: AccountAddress[];
  }) => void;
};

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "address", label: "Address", icon: <MapPin size={16} /> },
  { id: "password", label: "Password", icon: <KeyRound size={16} /> },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function EditProfileSheet({
  open,
  onOpenChange,
  user,
  phone,
  avatarUrl,
  defaultAddress,
  onSaved,
}: EditProfileSheetProps) {
  const { refreshSession } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [name, setName] = useState(user.name);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(avatarUrl);
  const [addressForm, setAddressForm] = useState<AccountAddress>(
    defaultAddress ?? {
      id: "draft",
      label: "Home",
      name: user.name,
      phone,
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: true,
    }
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(user.name);
    setPhoneValue(phone);
    setPreviewAvatar(avatarUrl);
    if (defaultAddress) setAddressForm(defaultAddress);
    setError(null);
    setSuccess(null);
    setActiveTab("profile");
  }, [open, user.name, phone, avatarUrl, defaultAddress, user]);

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewAvatar(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    const trimmedName = name.trim();
    const trimmedPhone = phoneValue.trim();

    if (!trimmedName) {
      setError("Name is required.");
      setIsSaving(false);
      return;
    }

    const result = await updateProfileOnServer({
      name: trimmedName,
      phone: trimmedPhone || undefined,
    });

    setStoredAvatar(user.id, previewAvatar);
    if (trimmedPhone) setStoredPhone(user.id, trimmedPhone);

    if (result.ok) {
      await refreshSession();
      setSuccess("Profile updated successfully.");
    } else {
      setStoredPhone(user.id, trimmedPhone);
      setSuccess(
        result.error?.includes("verify")
          ? "Saved locally. Verify your email to sync with the server."
          : "Saved on this device. Server sync will retry when available."
      );
    }

    onSaved({
      name: trimmedName,
      phone: trimmedPhone,
      avatarUrl: previewAvatar,
      addresses: defaultAddress ? [addressForm] : [],
    });

    setIsSaving(false);
  }

  function handleSaveAddress() {
    setError(null);

    if (
      !addressForm.line1.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.pincode.trim()
    ) {
      setError("Please fill in all required address fields.");
      return;
    }

    const updated: AccountAddress = {
      ...addressForm,
      name: name.trim() || user.name,
      phone: phoneValue.trim() || phone,
      line1: addressForm.line1.trim(),
      line2: addressForm.line2?.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      pincode: addressForm.pincode.trim(),
      isDefault: true,
    };

    setStoredAddresses(user.id, [updated]);
    onSaved({
      name: name.trim() || user.name,
      phone: phoneValue.trim() || phone,
      avatarUrl: previewAvatar,
      addresses: [updated],
    });
    setSuccess("Address saved.");
  }

  function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (newPassword.length < 10) {
      setError("New password must be at least 10 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setError(
      "Password changes are handled securely via email. Use the reset link below."
    );
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Profile"
      description="Update your photo, contact details, address, and security."
    >
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setError(null);
              setSuccess(null);
            }}
            className={cn(
              "flex h-11 min-h-[44px] shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/60 text-foreground hover:bg-secondary"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700" role="status">
          {success}
        </p>
      ) : null}

      {activeTab === "profile" ? (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {previewAvatar ? (
                <div className="relative size-24 overflow-hidden rounded-2xl shadow-md">
                  <Image
                    src={previewAvatar}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-2xl font-semibold text-primary-foreground shadow-md">
                  {getInitials(name || user.name)}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-md"
                aria-label="Change profile photo"
              >
                <Camera size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleAvatarChange}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload photo
              </Button>
              {previewAvatar ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-10 rounded-full text-destructive"
                  onClick={() => setPreviewAvatar(null)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </div>

          <AuthFormField id="edit-name" label="Full Name">
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className={authInputClassName}
            />
          </AuthFormField>

          <AuthFormField id="edit-email" label="Email">
            <input
              id="edit-email"
              type="email"
              value={user.email}
              disabled
              className={cn(authInputClassName, "opacity-60")}
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here. Contact support if needed.
            </p>
          </AuthFormField>

          <AuthFormField id="edit-phone" label="Phone Number">
            <input
              id="edit-phone"
              type="tel"
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value)}
              placeholder="+91 98765 43210"
              maxLength={20}
              className={authInputClassName}
            />
          </AuthFormField>

          <Button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="h-12 min-h-[44px] w-full rounded-full"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      ) : null}

      {activeTab === "address" ? (
        <div className="space-y-4">
          <AuthFormField id="addr-label" label="Label">
            <select
              id="addr-label"
              value={addressForm.label}
              onChange={(e) =>
                setAddressForm((c) => ({
                  ...c,
                  label: e.target.value as AccountAddress["label"],
                }))
              }
              className={authInputClassName}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </AuthFormField>

          <AuthFormField id="addr-line1" label="Address Line 1">
            <input
              id="addr-line1"
              value={addressForm.line1}
              onChange={(e) =>
                setAddressForm((c) => ({ ...c, line1: e.target.value }))
              }
              maxLength={200}
              className={authInputClassName}
            />
          </AuthFormField>

          <AuthFormField id="addr-line2" label="Address Line 2 (optional)">
            <input
              id="addr-line2"
              value={addressForm.line2 ?? ""}
              onChange={(e) =>
                setAddressForm((c) => ({ ...c, line2: e.target.value }))
              }
              maxLength={200}
              className={authInputClassName}
            />
          </AuthFormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AuthFormField id="addr-city" label="City">
              <input
                id="addr-city"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm((c) => ({ ...c, city: e.target.value }))
                }
                maxLength={100}
                className={authInputClassName}
              />
            </AuthFormField>
            <AuthFormField id="addr-state" label="State">
              <input
                id="addr-state"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm((c) => ({ ...c, state: e.target.value }))
                }
                maxLength={100}
                className={authInputClassName}
              />
            </AuthFormField>
          </div>

          <AuthFormField id="addr-pincode" label="Pincode">
            <input
              id="addr-pincode"
              value={addressForm.pincode}
              onChange={(e) =>
                setAddressForm((c) => ({
                  ...c,
                  pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                }))
              }
              inputMode="numeric"
              maxLength={6}
              className={authInputClassName}
            />
          </AuthFormField>

          <Button
            type="button"
            onClick={handleSaveAddress}
            className="h-12 min-h-[44px] w-full rounded-full"
          >
            Save Address
          </Button>
        </div>
      ) : null}

      {activeTab === "password" ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            For your security, password changes are verified by email. You can
            also request a reset link below.
          </p>

          <AuthFormField id="current-password" label="Current Password">
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={authInputClassName}
            />
          </AuthFormField>

          <AuthFormField id="new-password" label="New Password">
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={10}
              maxLength={128}
              className={authInputClassName}
            />
          </AuthFormField>

          <AuthFormField id="confirm-password" label="Confirm New Password">
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength={128}
              className={authInputClassName}
            />
          </AuthFormField>

          <Button type="submit" className="h-12 min-h-[44px] w-full rounded-full">
            Update Password
          </Button>

          <Button
            asChild
            type="button"
            variant="outline"
            className="h-12 min-h-[44px] w-full rounded-full"
          >
            <Link href="/forgot-password">Send password reset email</Link>
          </Button>
        </form>
      ) : null}
    </Sheet>
  );
}
