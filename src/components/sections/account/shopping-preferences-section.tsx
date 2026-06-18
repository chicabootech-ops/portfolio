"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { ShoppingPreferences } from "@/types/account";
import { updateProfile } from "@/lib/account/api";
import { SectionCard } from "./shared/section-card";

type ShoppingPreferencesSectionProps = {
  initial: ShoppingPreferences;
  onSaved?: () => Promise<void>;
};

export function ShoppingPreferencesSection({
  initial,
  onSaved,
}: ShoppingPreferencesSectionProps) {
  const [prefs, setPrefs] = useState(initial);
  const [isSaving, setIsSaving] = useState(false);

  async function savePreferences(next: ShoppingPreferences) {
    setPrefs(next);
    setIsSaving(true);
    try {
      await updateProfile({ preferences: next });
      await onSaved?.();
    } finally {
      setIsSaving(false);
    }
  }

  const toggle = (key: keyof ShoppingPreferences) => {
    if (typeof prefs[key] !== "boolean") return;
    void savePreferences({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <SectionCard title="Shopping Preferences">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["Theme", prefs.theme],
              ["Language", prefs.language],
              ["Currency", prefs.currency],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-border/25 bg-background/50 px-4 py-3"
            >
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-sm font-medium capitalize text-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border/20 divide-y divide-border/20">
          {(
            [
              ["marketing_emails", "Marketing emails", "Offers and new collections"],
              ["order_notifications", "Order updates", "Shipping and delivery alerts"],
              ["wishlist_alerts", "Wishlist notifications", "When wishlist items change"],
              ["price_alerts", "Price drop alerts", "When favourites go on sale"],
              ["back_in_stock_alerts", "Back in stock alerts", "When items are available again"],
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
                disabled={isSaving}
                aria-label={label}
              />
            </div>
          ))}
        </div>
        {isSaving ? (
          <p className="text-xs text-muted-foreground">Saving preferences…</p>
        ) : null}
      </div>
    </SectionCard>
  );
}
