"use client";

import {
  Bell,
  Globe,
  KeyRound,
  Link2,
  Lock,
  Shield,
  Smartphone,
  User,
} from "lucide-react";
import { SectionCard } from "./shared/section-card";
import { SettingsRow } from "./shared/settings-row";

const settingsGroups = [
  {
    title: "Account",
    items: [
      { icon: <User size={18} />, label: "Profile Information", href: "/account#profile" },
      { icon: <KeyRound size={18} />, label: "Change Password", href: "/account/security" },
      { icon: <Bell size={18} />, label: "Notifications", href: "/account/notifications" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: <Globe size={18} />, label: "Language", href: "/account/settings#language" },
      { icon: <Lock size={18} />, label: "Privacy Settings", href: "/account/settings#privacy" },
      { icon: <Shield size={18} />, label: "Security Settings", href: "/account/security" },
    ],
  },
  {
    title: "Devices & Connections",
    items: [
      { icon: <Smartphone size={18} />, label: "Manage Devices", href: "/account/security#devices" },
      { icon: <Link2 size={18} />, label: "Connected Accounts", href: "/account/settings#connected" },
    ],
  },
];

export function AccountSettingsSection() {
  return (
    <SectionCard title="Account Settings">
      <div className="space-y-5">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {group.title}
            </h3>
            <div className="overflow-hidden rounded-xl border border-border/20 divide-y divide-border/20">
              {group.items.map((item) => (
                <SettingsRow
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
