"use client";

import {
  Bell,
  KeyRound,
  Shield,
  Smartphone,
  User,
} from "lucide-react";
import { SectionCard } from "./shared/section-card";
import { SettingsRow } from "./shared/settings-row";

export function AccountSettingsSection({
  onEditProfile,
}: {
  onEditProfile?: () => void;
}) {
  const settingsGroups = [
    {
      title: "Account",
      items: [
        {
          icon: <User size={18} />,
          label: "Profile Information",
          onClick: onEditProfile,
        },
        {
          icon: <KeyRound size={18} />,
          label: "Change Password",
          href: "/account/security#password",
        },
        {
          icon: <Bell size={18} />,
          label: "Notifications",
          href: "/account/notifications",
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          icon: <Shield size={18} />,
          label: "Security Settings",
          href: "/account/security",
        },
        {
          icon: <Smartphone size={18} />,
          label: "Manage Devices",
          href: "/account/security#devices",
        },
      ],
    },
  ];

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
                  href={"href" in item ? item.href : undefined}
                  onClick={"onClick" in item ? item.onClick : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
