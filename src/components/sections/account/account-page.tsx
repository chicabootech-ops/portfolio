"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { useAuth } from "@/components/providers/auth-provider";
import {
  fetchAddresses,
  fetchProfile,
  fetchSecurity,
} from "@/lib/account/api";
import type { AccountAddress, SecurityStatus } from "@/types/account";
import type { AuthUser } from "@/types/auth";
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
import { DangerZoneSection } from "./danger-zone-section";
import { AccountPageSkeleton } from "./account-page-skeleton";

const EMPTY_STATS = { orders: 0, wishlist: 0, returns: 0, refunds: 0 };

export function AccountPage() {
  const router = useRouter();
  const { user, isLoading, refreshSession } = useAuth();
  const [editorOpen, setEditorOpen] = useState(false);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [addresses, setAddresses] = useState<AccountAddress[]>([]);
  const [security, setSecurity] = useState<SecurityStatus | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;
    if (!user.profile_completed) {
      router.replace("/onboarding");
      return;
    }

    let cancelled = false;
    setDataLoading(true);

    Promise.all([fetchProfile(), fetchAddresses(), fetchSecurity()])
      .then(([profileData, addressData, securityData]) => {
        if (cancelled) return;
        setProfile(profileData);
        setAddresses(addressData);
        setSecurity(securityData);
      })
      .catch(() => {
        if (!cancelled) {
          setProfile(user);
        }
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, isLoading, router]);

  if (isLoading || dataLoading || !user || !profile) {
    return <AccountPageSkeleton />;
  }

  const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0] ?? null;

  return (
    <main className="min-h-screen bg-background pb-24 pt-36 md:pb-16 md:pt-40">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <PageBreadcrumb
          items={[{ label: "Home", href: "/" }, { label: "My Account" }]}
          className="mb-4"
        />

        <div className="space-y-5 md:space-y-6">
          <AccountHeader
            user={profile}
            onEditProfile={() => setEditorOpen(true)}
          />
          <OrderShortcuts stats={EMPTY_STATS} />

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <div className="space-y-5 lg:col-span-2">
              <RecentOrders orders={[]} />
            </div>
            <AddressesSection addresses={addresses} />
            <PaymentMethodsSection methods={[]} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <AccountSettingsSection onEditProfile={() => setEditorOpen(true)} />
            {security ? (
              <SecurityCenter
                status={security}
                phone={profile.phone}
                onVerified={async () => {
                  const updatedSecurity = await fetchSecurity();
                  setSecurity(updatedSecurity);
                  await refreshSession();
                }}
              />
            ) : null}
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <SupportCenter />
            <ShoppingPreferencesSection
              initial={profile.preferences}
              onSaved={async () => {
                const updated = await fetchProfile();
                setProfile(updated);
                await refreshSession();
              }}
            />
          </div>

          <DangerZoneSection />
          <LogoutSection />
        </div>
      </div>

      <EditProfileSheet
        open={editorOpen}
        onOpenChange={setEditorOpen}
        user={profile}
        defaultAddress={defaultAddress}
        onSaved={async () => {
          const [updatedProfile, updatedAddresses] = await Promise.all([
            fetchProfile(),
            fetchAddresses(),
          ]);
          setProfile(updatedProfile);
          setAddresses(updatedAddresses);
          await refreshSession();
        }}
      />
    </main>
  );
}
