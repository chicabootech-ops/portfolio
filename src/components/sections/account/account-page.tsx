"use client";

import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { useAuth } from "@/components/providers/auth-provider";
import {
  accountAddresses,
  accountProfile,
  accountStats,
  defaultPreferences,
  paymentMethods,
  recentOrders,
  securityStatus,
} from "@/data/account-mock";
import { AccountHeader } from "./account-header";
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
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AccountPageSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-36 md:pb-16 md:pt-40">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <PageBreadcrumb
          items={[{ label: "Home", href: "/" }, { label: "My Account" }]}
          className="mb-4"
        />

        <div className="space-y-5 md:space-y-6">
          <AccountHeader user={user} profile={accountProfile} />
          <OrderShortcuts stats={accountStats} />

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <div className="space-y-5 lg:col-span-2">
              <RecentOrders orders={recentOrders} />
            </div>
            <AddressesSection addresses={accountAddresses} />
            <PaymentMethodsSection methods={paymentMethods} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <AccountSettingsSection />
            <SecurityCenter status={securityStatus} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <SupportCenter />
            <ShoppingPreferencesSection initial={defaultPreferences} />
          </div>

          <LogoutSection />
        </div>
      </div>
    </main>
  );
}
