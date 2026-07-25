"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { useAddresses } from "@/hooks/useAddresses";
import { useMe } from "@/hooks/useMe";
import { useSecurityDevices } from "@/hooks/useSecurity";
import { deriveSecurityStatus, mapUserAddressToAccount } from "@/lib/account/adapters";
import { mapCurrentUserToAuthUser } from "@/lib/auth/map-user";
import { mapOrderStatus } from "@/lib/orders";
import type { AccountAddress, AccountOrder } from "@/types/account";
import type { AuthUser } from "@/types/auth";
import { fetchMyOrders } from "@/services/commerce.service";
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
  const { data: me, isLoading: meLoading } = useMe();
  const hasSession = Boolean(me);
  const { data: addressRows, isLoading: addrLoading } = useAddresses(hasSession);
  const { data: devices } = useSecurityDevices(hasSession);
  const [editorOpen, setEditorOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState<AccountOrder[]>([]);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!hasSession) return;
    fetchMyOrders()
      .then((res) => {
        setOrderCount(res.total ?? res.items?.length ?? 0);
        setRecentOrders(
          (res.items ?? []).slice(0, 3).map((o) => ({
            id: o.id,
            orderNumber: `#${o.order_number}`,
            productName: `${o.item_count} item${o.item_count === 1 ? "" : "s"}`,
            productImage: "/collections/tulips.jpeg",
            status: mapOrderStatus(o.status),
            price: o.grand_total_paise / 100,
            orderedAt: o.created_at,
          }))
        );
      })
      .catch(() => {
        setRecentOrders([]);
      });
  }, [hasSession]);

  useEffect(() => {
    if (meLoading) return;
    if (!me) {
      router.replace("/login?next=/account");
      return;
    }
    const onboarding = me.onboarding;
    // Don't loop completed users into onboarding. Backend used to require last_name
    // for profile_complete; single-name + address is enough to use the account.
    if (onboarding && !onboarding.shopping_ready) {
      const hasName = Boolean(me.profile?.first_name?.trim());
      if (!hasName || !onboarding.has_address) {
        router.replace("/onboarding");
      }
    }
  }, [me, meLoading, router]);

  if (meLoading || !me) {
    return <AccountPageSkeleton />;
  }

  const profile: AuthUser = mapCurrentUserToAuthUser(me);
  const addresses: AccountAddress[] = (addressRows ?? []).map(mapUserAddressToAccount);
  const security = deriveSecurityStatus(me, devices?.length ?? 0);
  const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0] ?? null;
  const addressesReady = !addrLoading;

  return (
    <main className="min-h-screen bg-background pb-24 pt-36 md:pb-16 md:pt-40">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <PageBreadcrumb
          items={[{ label: "Home", href: "/" }, { label: "My Account" }]}
          className="mb-4 md:mt-10"
        />

        <div className="space-y-5 md:space-y-6">
          <AccountHeader user={profile} onEditProfile={() => setEditorOpen(true)} />
          <OrderShortcuts stats={{ ...EMPTY_STATS, orders: orderCount }} />

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <div className="space-y-5 lg:col-span-2">
              <RecentOrders orders={recentOrders} />
            </div>
            {addressesReady ? (
              <AddressesSection addresses={addresses} />
            ) : (
              <div className="h-40 animate-pulse rounded-2xl bg-secondary/30" />
            )}
            <PaymentMethodsSection methods={[]} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <ShoppingPreferencesSection preferences={me.preferences} />
            <SecurityCenter status={security} phone={profile.phone} email={profile.email} />
          </div>

          <AccountSettingsSection onEditProfile={() => setEditorOpen(true)} />
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
      />
    </main>
  );
}
