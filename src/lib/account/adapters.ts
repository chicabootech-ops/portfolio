import type { AccountAddress, SecurityStatus, ShoppingPreferences } from "@/types/account";
import type {
  AddressCreatePayload,
  AddressUpdatePayload,
  CurrentUser,
  PreferencesUpdatePayload,
  UserAddress,
  UserPreferences,
} from "@/types/user";

export function mapUserAddressToAccount(addr: UserAddress): AccountAddress {
  const labelMap: Record<string, AccountAddress["label"]> = {
    home: "Home",
    office: "Work",
    work: "Work",
    shipping: "Home",
    billing: "Other",
    other: "Other",
  };
  return {
    id: addr.id,
    label: labelMap[addr.address_type] ?? (addr.label as AccountAddress["label"]) ?? "Other",
    name: addr.full_name,
    phone: addr.phone ?? "",
    line1: addr.line1,
    line2: addr.line2 ?? undefined,
    city: addr.city,
    state: addr.state,
    pincode: addr.postal_code,
    is_default: addr.is_default,
  };
}

export function mapAccountToCreate(
  addr: Omit<AccountAddress, "id"> | Partial<AccountAddress>
): AddressCreatePayload {
  const typeMap: Record<string, string> = {
    Home: "home",
    Work: "office",
    Other: "other",
  };
  return {
    full_name: addr.name ?? "",
    phone: addr.phone || null,
    line1: addr.line1 ?? "",
    line2: addr.line2 ?? null,
    city: addr.city ?? "",
    state: addr.state ?? "",
    postal_code: addr.pincode ?? "",
    country: "IN",
    address_type: typeMap[addr.label ?? "Other"] ?? "home",
    label: addr.label ?? null,
    is_default: addr.is_default ?? false,
  };
}

export function mapAccountToUpdate(addr: Partial<AccountAddress>): AddressUpdatePayload {
  return mapAccountToCreate(addr as Omit<AccountAddress, "id">);
}

export function mapUserPreferencesToShopping(prefs: UserPreferences): ShoppingPreferences {
  return {
    theme: "system",
    language: prefs.preferred_language,
    currency: prefs.currency,
    marketing_emails: prefs.email_marketing,
    order_notifications: prefs.order_updates_email,
    wishlist_alerts: false,
    price_alerts: false,
    back_in_stock_alerts: false,
  };
}

export function mapShoppingToPreferencesUpdate(
  prefs: ShoppingPreferences
): PreferencesUpdatePayload {
  return {
    preferred_language: prefs.language,
    currency: prefs.currency,
    email_marketing: prefs.marketing_emails,
    order_updates_email: prefs.order_notifications,
  };
}

export function deriveSecurityStatus(me: CurrentUser, activeDevices = 0): SecurityStatus {
  return {
    email_verified: me.email_verified,
    phone_verified: me.phone_verified,
    password_set: true,
    two_factor_enabled: false,
    active_sessions: activeDevices,
    last_login_at: me.last_login_at,
    account_created_at: me.created_at,
  };
}
