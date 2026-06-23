"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, KeyRound, MapPin, User } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AuthFormField, authInputClassName } from "@/components/sections/auth/auth-form-field";
import { useCreateAddress, useUpdateAddress } from "@/hooks/useAddresses";
import { useAvatarUpload } from "@/hooks/useAvatar";
import { useDisplayAvatar } from "@/hooks/useDisplayAvatar";
import { useUpdateMe } from "@/hooks/useMe";
import { mapAccountToCreate, mapAccountToUpdate } from "@/lib/account/adapters";
import { splitFullName } from "@/lib/auth/map-user";
import type { AccountAddress } from "@/types/account";
import type { AuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";

type TabId = "profile" | "address" | "password";

type EditProfileSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser;
  defaultAddress: AccountAddress | null;
};

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "address", label: "Address", icon: <MapPin size={16} /> },
  { id: "password", label: "Password", icon: <KeyRound size={16} /> },
];

export function EditProfileSheet({
  open,
  onOpenChange,
  user,
  defaultAddress,
}: EditProfileSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateMe = useUpdateMe();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const { uploadAsync, isUploading, progress } = useAvatarUpload();

  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [blobPreview, setBlobPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { src: displayAvatar } = useDisplayAvatar(user.avatar_url, blobPreview);
  const [addressForm, setAddressForm] = useState<AccountAddress | null>(defaultAddress);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(user.name);
    setPhone(user.phone ?? "");
    setBlobPreview(null);
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
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }
    setAvatarFile(file);
    setBlobPreview(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSaveProfile() {
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      if (!name.trim()) throw new Error("Name is required.");
      const { first_name, last_name } = splitFullName(name);
      await updateMe.mutateAsync({
        first_name,
        last_name: last_name ?? undefined,
        phone: phone.trim() || undefined,
      });
      if (avatarFile) {
        await uploadAsync(avatarFile);
        setBlobPreview(null);
      }
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
        await updateAddress.mutateAsync({
          id: addressForm.id,
          payload: mapAccountToUpdate(payload),
        });
      } else {
        await createAddress.mutateAsync(mapAccountToCreate(payload));
      }
      setSuccess("Address saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save address");
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
  const busy = isSaving || isUploading || updateMe.isPending;

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
              {displayAvatar ? <Image src={displayAvatar} alt="" fill className="object-cover" unoptimized /> : <Camera className="absolute inset-0 m-auto text-muted-foreground" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/webp,image/jpeg,image/png" className="sr-only" onChange={handleAvatarChange} />
            {isUploading ? <p className="text-xs text-muted-foreground">Uploading… {progress}%</p> : null}
          </div>
          <AuthFormField label="Full name" id="edit-name"><input id="edit-name" className={authInputClassName} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></AuthFormField>
          <AuthFormField label="Email" id="edit-email"><input id="edit-email" className={authInputClassName} value={user.email} readOnly disabled autoComplete="off" /></AuthFormField>
          <AuthFormField label="Phone" id="edit-phone"><input id="edit-phone" className={authInputClassName} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" /></AuthFormField>
          <Button type="button" className="h-11 w-full rounded-full" disabled={busy} onClick={handleSaveProfile}>{busy ? "Saving…" : "Save profile"}</Button>
        </div>
      ) : null}

      {activeTab === "address" ? (
        <div className="space-y-4">
          <AuthFormField label="Address line 1" id="addr-line1"><input id="addr-line1" className={authInputClassName} value={form.line1} onChange={(e) => setAddressForm({ ...form, line1: e.target.value })} autoComplete="address-line1" /></AuthFormField>
          <AuthFormField label="City" id="addr-city"><input id="addr-city" className={authInputClassName} value={form.city} onChange={(e) => setAddressForm({ ...form, city: e.target.value })} autoComplete="address-level2" /></AuthFormField>
          <AuthFormField label="State" id="addr-state"><input id="addr-state" className={authInputClassName} value={form.state} onChange={(e) => setAddressForm({ ...form, state: e.target.value })} autoComplete="address-level1" /></AuthFormField>
          <AuthFormField label="Pincode" id="addr-pin"><input id="addr-pin" className={authInputClassName} value={form.pincode} onChange={(e) => setAddressForm({ ...form, pincode: e.target.value })} maxLength={6} autoComplete="postal-code" /></AuthFormField>
          <Button type="button" className="h-11 w-full rounded-full" disabled={busy} onClick={handleSaveAddress}>{busy ? "Saving…" : "Save address"}</Button>
        </div>
      ) : null}

      {activeTab === "password" ? (
        <div className="space-y-4 rounded-xl border border-border/20 bg-secondary/20 p-4 text-sm text-muted-foreground">
          <p>To change your password, use the forgot-password flow. We email you a secure reset link.</p>
          <Button type="button" asChild className="h-11 w-full rounded-full">
            <Link href="/forgot-password">Reset password</Link>
          </Button>
        </div>
      ) : null}
    </Sheet>
  );
}
