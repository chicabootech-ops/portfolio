"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, KeyRound, MapPin, User } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AuthFormField, authInputClassName } from "@/components/sections/auth/auth-form-field";
import {
  changePassword,
  createAddress,
  updateAddress,
  updateProfile,
  uploadAvatar,
} from "@/lib/account/api";
import { apiConfig } from "@/config/api";
import type { AccountAddress } from "@/types/account";
import type { AuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";

type TabId = "profile" | "address" | "password";

type EditProfileSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser;
  defaultAddress: AccountAddress | null;
  onSaved: () => Promise<void>;
};

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "address", label: "Address", icon: <MapPin size={16} /> },
  { id: "password", label: "Password", icon: <KeyRound size={16} /> },
];

function resolveAvatarUrl(url: string | null) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${apiConfig.baseUrl}${url}`;
}

export function EditProfileSheet({
  open,
  onOpenChange,
  user,
  defaultAddress,
  onSaved,
}: EditProfileSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(resolveAvatarUrl(user.avatar_url));
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [addressForm, setAddressForm] = useState<AccountAddress | null>(defaultAddress);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(user.name);
    setPhone(user.phone ?? "");
    setPreviewAvatar(resolveAvatarUrl(user.avatar_url));
    setAddressForm(defaultAddress);
    setError(null);
    setSuccess(null);
    setActiveTab("profile");
    setAvatarFile(null);
  }, [open, user, defaultAddress]);

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
    setAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSaveProfile() {
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      if (!name.trim()) throw new Error("Name is required.");
      await updateProfile({ name: name.trim(), phone: phone.trim() || undefined });
      if (avatarFile) await uploadAvatar(avatarFile);
      await onSaved();
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveAddress() {
    if (!addressForm) return;
    setError(null);
    setIsSaving(true);
    try {
      const payload = {
        ...addressForm,
        name: name.trim() || user.name,
        phone: phone.trim() || user.phone || "",
        is_default: true,
      };
      if (addressForm.id && addressForm.id !== "draft") {
        await updateAddress(addressForm.id, payload);
      } else {
        await createAddress(payload);
      }
      await onSaved();
      setSuccess("Address saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save address");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent) {
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
    setIsSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Password changed. Please sign in again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setIsSaving(false);
    }
  }

  const emptyAddress: AccountAddress = {
    id: "draft",
    label: "Home",
    name: user.name,
    phone: user.phone ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "Haryana",
    pincode: "",
    is_default: true,
  };

  const form = addressForm ?? emptyAddress;

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Edit Profile" description="Update your photo, contact details, address, and security.">
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTab(tab.id); setError(null); setSuccess(null); }}
            className={cn(
              "flex h-11 min-h-[44px] shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-foreground hover:bg-secondary"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {error ? <p className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">{error}</p> : null}
      {success ? <p className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700" role="status">{success}</p> : null}

      {activeTab === "profile" ? (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-3">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="relative size-24 overflow-hidden rounded-2xl bg-secondary/60">
              {previewAvatar ? <Image src={previewAvatar} alt="" fill className="object-cover" unoptimized /> : <Camera className="absolute inset-0 m-auto text-muted-foreground" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
          </div>
          <AuthFormField label="Full name" id="edit-name"><input id="edit-name" className={authInputClassName} value={name} onChange={(e) => setName(e.target.value)} /></AuthFormField>
          <AuthFormField label="Email" id="edit-email"><input id="edit-email" className={authInputClassName} value={user.email} readOnly disabled /></AuthFormField>
          <AuthFormField label="Phone" id="edit-phone"><input id="edit-phone" className={authInputClassName} value={phone} onChange={(e) => setPhone(e.target.value)} /></AuthFormField>
          <Button type="button" className="h-11 w-full rounded-full" disabled={isSaving} onClick={handleSaveProfile}>{isSaving ? "Saving…" : "Save profile"}</Button>
        </div>
      ) : null}

      {activeTab === "address" ? (
        <div className="space-y-4">
          <AuthFormField label="Address line 1" id="addr-line1"><input id="addr-line1" className={authInputClassName} value={form.line1} onChange={(e) => setAddressForm({ ...form, line1: e.target.value })} /></AuthFormField>
          <AuthFormField label="City" id="addr-city"><input id="addr-city" className={authInputClassName} value={form.city} onChange={(e) => setAddressForm({ ...form, city: e.target.value })} /></AuthFormField>
          <AuthFormField label="State" id="addr-state"><input id="addr-state" className={authInputClassName} value={form.state} onChange={(e) => setAddressForm({ ...form, state: e.target.value })} /></AuthFormField>
          <AuthFormField label="Pincode" id="addr-pin"><input id="addr-pin" className={authInputClassName} value={form.pincode} onChange={(e) => setAddressForm({ ...form, pincode: e.target.value })} maxLength={6} /></AuthFormField>
          <Button type="button" className="h-11 w-full rounded-full" disabled={isSaving} onClick={handleSaveAddress}>{isSaving ? "Saving…" : "Save address"}</Button>
        </div>
      ) : null}

      {activeTab === "password" ? (
        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          <AuthFormField label="Current password" id="cur-pass"><input id="cur-pass" type="password" className={authInputClassName} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></AuthFormField>
          <AuthFormField label="New password" id="new-pass"><input id="new-pass" type="password" className={authInputClassName} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></AuthFormField>
          <AuthFormField label="Confirm password" id="conf-pass"><input id="conf-pass" type="password" className={authInputClassName} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></AuthFormField>
          <Button type="submit" className="h-11 w-full rounded-full" disabled={isSaving}>{isSaving ? "Updating…" : "Change password"}</Button>
        </form>
      ) : null}
    </Sheet>
  );
}
