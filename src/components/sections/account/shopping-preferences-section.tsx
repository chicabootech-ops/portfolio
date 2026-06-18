"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import type { ShoppingPreferences } from "@/types/account";
import { SectionCard } from "./shared/section-card";

type ShoppingPreferencesSectionProps = {
  initial: ShoppingPreferences;
};

export function ShoppingPreferencesSection({
  initial,
}: ShoppingPreferencesSectionProps) {
  const [prefs, setPrefs] = useState(initial);

  const toggle = (key: keyof ShoppingPreferences) => {
    setPrefs((current) => ({
      ...current,
      [key]: !current[key],
    }));
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
              ["marketingEmails", "Marketing emails", "Offers and new collections"],
              ["orderUpdates", "Order updates", "Shipping and delivery alerts"],
              ["wishlistAlerts", "Wishlist notifications", "When wishlist items change"],
              ["priceDropAlerts", "Price drop alerts", "When favourites go on sale"],
              ["backInStockAlerts", "Back in stock alerts", "When items are available again"],
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
                aria-label={label}
              />
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
