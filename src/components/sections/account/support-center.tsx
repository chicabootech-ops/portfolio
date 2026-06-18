"use client";

import {
  AlertCircle,
  Headphones,
  HelpCircle,
  MessageCircle,
  Ticket,
} from "lucide-react";
import { SectionCard } from "./shared/section-card";
import { SettingsRow } from "./shared/settings-row";

const supportItems = [
  { icon: <HelpCircle size={18} />, label: "Help Center", href: "/help" },
  { icon: <HelpCircle size={18} />, label: "FAQs", href: "/help/faq" },
  { icon: <Headphones size={18} />, label: "Contact Support", href: "/contact" },
  { icon: <MessageCircle size={18} />, label: "Live Chat", href: "/contact#chat" },
  { icon: <Ticket size={18} />, label: "Raise Ticket", href: "/support/ticket" },
  { icon: <AlertCircle size={18} />, label: "Report Issue", href: "/support/report" },
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
