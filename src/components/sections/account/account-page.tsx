"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { useAuth } from "@/components/providers/auth-provider";
import { useAddresses } from "@/hooks/useAddresses";
import { useMe, useOnboarding } from "@/hooks/useMe";
import { useSecurityDevices } from "@/hooks/useSecurity";
import { deriveSecurityStatus } from "@/lib/account/adapters";
import { mapUserAddressToAccount } from "@/lib/account/adapters";
import type { AccountAddress } from "@/types/account";
import type { AuthUser } from "@/types/auth";
import { mapCurrentUserToAuthUser } from "@/lib/auth/map-user";
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
  const { user: authUser, isLoading: authLoading } = useAuth();
  const { data: me, isLoading: meLoading, refetch: refetchMe } = useMe();
  const { data: onboarding } = useOnboarding();
  const { data: addressRows, isLoading: addrLoading } = useAddresses();
  const { data: devices } = useSecurityDevices();
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    if (authLoading || meLoading) return;
    if (!authUser) {
      router.replace("/login?next=/account");
      return;
    }
    if (onboarding && !onboarding.shopping_ready && !onboarding.profile_complete) {
      router.replace("/onboarding");
    }
  }, [authUser, authLoading, meLoading, onboarding, router]);

  if (authLoading || meLoading || addrLoading || !authUser || !me) {
    return <AccountPageSkeleton />;
  }

  const profile: AuthUser = mapCurrentUserToAuthUser(me);
  const addresses: AccountAddress[] = (addressRows ?? []).map(mapUserAddressToAccount);
  const security = deriveSecurityStatus(me, devices?.length ?? 0);
  const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0] ?? null;

  async function handleSaved() {
    await refetchMe();
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-36 md:pb-16 md:pt-40">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <PageBreadcrumb
          items={[{ label: "Home", href: "/" }, { label: "My Account" }]}
          className="mb-4 md:mt-10"
        />

        <div className="space-y-5 md:space-y-6">
          <AccountHeader user={profile} onEditProfile={() => setEditorOpen(true)} />
          <OrderShortcuts stats={EMPTY_STATS} />

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <div className="space-y-5 lg:col-span-2">
              <RecentOrders orders={[]} />
            </div>
            <AddressesSection addresses={addresses} />
            <PaymentMethodsSection methods={[]} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <ShoppingPreferencesSection />
            <SecurityCenter status={security} phone={profile.phone} email={profile.email} onVerified={handleSaved} />
          </div>

          <AccountSettingsSection />
          <SupportCenter />
          <LogoutSection />
          <DangerZoneSection />
        </div>
      </div>

      <EditProfileSheet
        open={editorOpen}
        onOpenChange={setEditorOpen}
        user={profile}
        defaultAddress={defaultAddress}
        onSaved={handleSaved}
      />
    </main>
  );
}
