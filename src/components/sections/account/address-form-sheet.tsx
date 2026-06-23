"use client";

import { useEffect, useState } from "react";
import { AuthFormField, authInputClassName } from "@/components/sections/auth/auth-form-field";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { AccountAddress } from "@/types/account";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];

export const EMPTY_ADDRESS_FORM: Omit<AccountAddress, "id"> = {
  label: "Home",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "Haryana",
  pincode: "",
  is_default: false,
};

type AddressFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initial: Omit<AccountAddress, "id"> & { id?: string };
  isFirstAddress?: boolean;
  isSaving?: boolean;
  onSubmit: (address: AccountAddress | Omit<AccountAddress, "id">) => Promise<void>;
};

export function AddressFormSheet({
  open,
  onOpenChange,
  mode,
  initial,
  isFirstAddress = false,
  isSaving = false,
  onSubmit,
}: AddressFormSheetProps) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...initial,
      is_default: isFirstAddress ? true : initial.is_default,
    });
    setError(null);
  }, [open, initial, isFirstAddress]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.line1.trim() || !form.city.trim() || !form.pincode.trim()) {
      setError("Name, address, city and pincode are required.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Enter a valid 6-digit pincode.");
      return;
    }

    try {
      const payload =
        mode === "edit" && initial.id
          ? ({ ...form, id: initial.id } as AccountAddress)
          : form;
      await onSubmit(payload);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save address.");
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "add" ? "Add address" : "Edit address"}
      description="Delivery details for your Chic A Boo orders."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <AuthFormField label="Label" id="addr-label">
          <select
            id="addr-label"
            className={authInputClassName}
            value={form.label}
            onChange={(e) =>
              setForm({ ...form, label: e.target.value as AccountAddress["label"] })
            }
          >
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
        </AuthFormField>

        <AuthFormField label="Full name" id="addr-name">
          <input
            id="addr-name"
            className={authInputClassName}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoComplete="name"
          />
        </AuthFormField>

        <AuthFormField label="Phone" id="addr-phone">
          <input
            id="addr-phone"
            className={authInputClassName}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            autoComplete="tel"
            inputMode="tel"
          />
        </AuthFormField>

        <AuthFormField label="Address line 1" id="addr-line1">
          <input
            id="addr-line1"
            className={authInputClassName}
            value={form.line1}
            onChange={(e) => setForm({ ...form, line1: e.target.value })}
            autoComplete="address-line1"
          />
        </AuthFormField>

        <AuthFormField label="Address line 2 (optional)" id="addr-line2">
          <input
            id="addr-line2"
            className={authInputClassName}
            value={form.line2 ?? ""}
            onChange={(e) => setForm({ ...form, line2: e.target.value })}
            autoComplete="address-line2"
          />
        </AuthFormField>

        <div className="grid grid-cols-2 gap-3">
          <AuthFormField label="City" id="addr-city">
            <input
              id="addr-city"
              className={authInputClassName}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              autoComplete="address-level2"
            />
          </AuthFormField>
          <AuthFormField label="Pincode" id="addr-pin">
            <input
              id="addr-pin"
              className={authInputClassName}
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              maxLength={6}
              inputMode="numeric"
              autoComplete="postal-code"
            />
          </AuthFormField>
        </div>

        <AuthFormField label="State" id="addr-state">
          <select
            id="addr-state"
            className={authInputClassName}
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            autoComplete="address-level1"
          >
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </AuthFormField>

        {!isFirstAddress ? (
          <label className="flex min-h-[44px] items-center gap-3 rounded-xl border border-border/25 px-4 py-3">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
              className="size-4 accent-primary"
            />
            <span className="text-sm text-foreground">Set as default address</span>
          </label>
        ) : null}

        <Button
          type="submit"
          disabled={isSaving}
          className="h-11 w-full rounded-full text-sm font-semibold"
        >
          {isSaving ? "Saving…" : mode === "add" ? "Save address" : "Update address"}
        </Button>
      </form>
    </Sheet>
  );
}
