"use client";

import { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { useAuth } from "@/components/providers/auth-provider";
import {
  accountAddresses as mockAddresses,
  accountProfile as mockProfile,
  accountStats,
  defaultPreferences,
  paymentMethods,
  recentOrders,
  securityStatus,
} from "@/data/account-mock";
import {
  getStoredAddresses,
  getStoredAvatar,
  getStoredPhone,
} from "@/lib/account/profile-storage";
import type { AccountAddress, AccountProfile } from "@/types/account";
import { AccountHeader } from "./account-header";
import { EditProfileSheet } from "./edit-profile-sheet";
import { OrderShortcuts } from "./order-shortcuts";
import { RecentOrders } from "./recent-orders";
import { AddressesSection } from "./addresses-section";
import { PaymentMethodsSection } from "./payment-methods-section";
import { AccountSettingsSection } from "./account-settings-section";
import { SecurityCenter } from "./security-center";
import { SupportCenter } from "./support-center";
import { ShoppingPreferencesSection } from "./shopping-preferences-section";
import { LogoutSection } from "./logout-section";
import { AccountPageSkeleton } from "./account-page-skeleton";

export function AccountPage() {
  const { user, isLoading, refreshSession } = useAuth();
  const [editorOpen, setEditorOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState(mockProfile.phone);
  const [addresses, setAddresses] = useState<AccountAddress[]>(mockAddresses);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.name);
    setAvatarUrl(getStoredAvatar(user.id));
    const storedPhone = getStoredPhone(user.id);
    if (storedPhone) setPhone(storedPhone);
    const storedAddresses = getStoredAddresses(user.id);
    if (storedAddresses?.length) setAddresses(storedAddresses);
  }, [user]);

  const profile: AccountProfile = useMemo(
    () => ({
      ...mockProfile,
      phone,
    }),
    [phone]
  );

  const headerUser = useMemo(
    () => (user ? { ...user, name: displayName || user.name } : null),
    [user, displayName]
  );

  if (isLoading) {
    return <AccountPageSkeleton />;
  }

  if (!user || !headerUser) {
    return null;
  }

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;

  return (
    <main className="min-h-screen bg-background pb-24 pt-36 md:pb-16 md:pt-40">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <PageBreadcrumb
          items={[{ label: "Home", href: "/" }, { label: "My Account" }]}
          className="mb-4"
        />

        <div className="space-y-5 md:space-y-6">
          <AccountHeader
            user={headerUser}
            profile={profile}
            avatarUrl={avatarUrl}
            onEditProfile={() => setEditorOpen(true)}
          />
          <OrderShortcuts stats={accountStats} />

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <div className="space-y-5 lg:col-span-2">
              <RecentOrders orders={recentOrders} />
            </div>
            <AddressesSection addresses={addresses} />
            <PaymentMethodsSection methods={paymentMethods} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <AccountSettingsSection onEditProfile={() => setEditorOpen(true)} />
            <SecurityCenter status={securityStatus} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <SupportCenter />
            <ShoppingPreferencesSection initial={defaultPreferences} />
          </div>

          <LogoutSection />
        </div>
      </div>

      <EditProfileSheet
        open={editorOpen}
        onOpenChange={setEditorOpen}
        user={headerUser}
        phone={phone}
        avatarUrl={avatarUrl}
        defaultAddress={defaultAddress}
        onSaved={async (data) => {
          setDisplayName(data.name);
          setPhone(data.phone);
          setAvatarUrl(data.avatarUrl);
          if (data.addresses.length) setAddresses(data.addresses);
          await refreshSession();
        }}
      />
    </main>
  );
}
