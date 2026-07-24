"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import type { ShoppingPreferences } from "@/types/account";
import type { UserPreferences } from "@/types/user";
import { usePreferences, useUpdatePreferences } from "@/hooks/usePreferences";
import { mapShoppingToPreferencesUpdate, mapUserPreferencesToShopping } from "@/lib/account/adapters";
import { authInputClassName } from "@/components/sections/auth/auth-form-field";
import { SectionCard } from "./shared/section-card";

const DEFAULT_PREFS: ShoppingPreferences = {
  theme: "system",
  language: "en",
  currency: "INR",
  marketing_emails: false,
  order_notifications: true,
  wishlist_alerts: false,
  price_alerts: false,
  back_in_stock_alerts: false,
};

type ShoppingPreferencesSectionProps = {
  preferences?: UserPreferences | null;
};

export function ShoppingPreferencesSection({ preferences }: ShoppingPreferencesSectionProps) {
  const skipFetch = Boolean(preferences);
  const { data, isLoading } = usePreferences(preferences, !skipFetch);
  const updatePrefs = useUpdatePreferences();
  const [prefs, setPrefs] = useState<ShoppingPreferences>(DEFAULT_PREFS);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const source = preferences ?? data;
    if (source) setPrefs(mapUserPreferencesToShopping(source));
  }, [preferences, data]);

  async function savePreferences(next: ShoppingPreferences) {
    setSaveError(null);
    setPrefs(next);
    try {
      await updatePrefs.mutateAsync(mapShoppingToPreferencesUpdate(next));
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save preferences");
    }
  }

  const toggle = (key: keyof ShoppingPreferences) => {
    if (typeof prefs[key] !== "boolean") return;
    void savePreferences({ ...prefs, [key]: !prefs[key] });
  };

  if (!skipFetch && isLoading) {
    return (
      <SectionCard title="Shopping Preferences">
        <p className="text-sm text-muted-foreground">Loading preferences…</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Shopping Preferences" id="preferences">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs text-muted-foreground">Language</span>
            <select
              className={authInputClassName}
              value={prefs.language}
              disabled={updatePrefs.isPending}
              onChange={(e) =>
                void savePreferences({ ...prefs, language: e.target.value })
              }
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs text-muted-foreground">Currency</span>
            <select
              className={authInputClassName}
              value={prefs.currency}
              disabled
              aria-readonly
            >
              <option value="INR">INR</option>
            </select>
          </label>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/20 divide-y divide-border/20">
          {(
            [
              ["marketing_emails", "Marketing emails", "Offers and new collections"],
              ["order_notifications", "Order updates", "Shipping and delivery alerts"],
            ] as const
          ).map(([key, label, description]) => (
            <div
              key={key}
              className="flex min-h-[56px] items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Switch
                checked={prefs[key]}
                onCheckedChange={() => toggle(key)}
                disabled={updatePrefs.isPending}
                aria-label={label}
              />
            </div>
          ))}
        </div>
        {updatePrefs.isPending ? (
          <p className="text-xs text-muted-foreground">Saving preferences…</p>
        ) : null}
        {saveError ? (
          <p className="text-xs text-destructive" role="alert">
            {saveError}
          </p>
        ) : null}
      </div>
    </SectionCard>
  );
}
