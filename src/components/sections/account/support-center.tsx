"use client";

import {
  Headphones,
  HelpCircle,
  MapPin,
  Package,
  Users,
} from "lucide-react";
import { SectionCard } from "./shared/section-card";
import { SettingsRow } from "./shared/settings-row";

const supportItems = [
  { icon: <Users size={18} />, label: "About the Founders", href: "/about" },
  { icon: <Package size={18} />, label: "Track an order", href: "/track-order" },
  { icon: <MapPin size={18} />, label: "Saved addresses", href: "/account/addresses" },
  { icon: <HelpCircle size={18} />, label: "Account security", href: "/account/security" },
  {
    icon: <Headphones size={18} />,
    label: "Email support",
    href: "mailto:hello@chicaboo.co?subject=Chic%20A%20Boo%20support",
  },
];

export function SupportCenter() {
  return (
    <SectionCard title="Support">
      <div className="overflow-hidden rounded-xl border border-border/20 divide-y divide-border/20">
        {supportItems.map((item) => (
          <SettingsRow
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
          />
        ))}
      </div>
    </SectionCard>
  );
}
