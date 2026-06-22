"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import type { ShoppingPreferences } from "@/types/account";
import { usePreferences, useUpdatePreferences } from "@/hooks/usePreferences";
import { mapShoppingToPreferencesUpdate, mapUserPreferencesToShopping } from "@/lib/account/adapters";
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

export function ShoppingPreferencesSection() {
  const { data, isLoading } = usePreferences();
  const updatePrefs = useUpdatePreferences();
  const [prefs, setPrefs] = useState<ShoppingPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    if (data) setPrefs(mapUserPreferencesToShopping(data));
  }, [data]);

  async function savePreferences(next: ShoppingPreferences) {
    setPrefs(next);
    await updatePrefs.mutateAsync(mapShoppingToPreferencesUpdate(next));
  }

  const toggle = (key: keyof ShoppingPreferences) => {
    if (typeof prefs[key] !== "boolean") return;
    void savePreferences({ ...prefs, [key]: !prefs[key] });
  };

  if (isLoading) {
    return (
      <SectionCard title="Shopping Preferences">
        <p className="text-sm text-muted-foreground">Loading preferences…</p>
      </SectionCard>
    );
  }

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
                disabled={updatePrefs.isPending || key === "wishlist_alerts" || key === "price_alerts" || key === "back_in_stock_alerts"}
                aria-label={label}
              />
            </div>
          ))}
        </div>
        {updatePrefs.isPending ? (
          <p className="text-xs text-muted-foreground">Saving preferences…</p>
        ) : null}
      </div>
    </SectionCard>
  );
}
