import type { AuthUser } from "@/types/auth";
import type { CurrentUser } from "@/types/user";

/** Map UserService CurrentUser → legacy AuthUser shape used by UI. */
export function mapCurrentUserToAuthUser(me: CurrentUser): AuthUser {
  const first = me.profile?.first_name ?? "";
  const last = me.profile?.last_name ?? "";
  const name = [first, last].filter(Boolean).join(" ").trim() || me.email.split("@")[0];

  return {
    id: me.id,
    email: me.email,
    name,
    phone: me.phone,
    role: "customer",
    is_verified: me.email_verified,
    phone_verified: me.phone_verified,
    profile_completed: me.onboarding?.shopping_ready ?? false,
    avatar_url: me.profile?.avatar_url ?? null,
    preferences: {
      theme: "system",
      language: me.preferences?.preferred_language ?? "en",
      currency: me.preferences?.currency ?? "INR",
      marketing_emails: me.preferences?.email_marketing ?? false,
      order_notifications: me.preferences?.order_updates_email ?? true,
      wishlist_alerts: false,
      price_alerts: false,
      back_in_stock_alerts: false,
    },
    created_at: me.created_at,
  };
}

export function splitFullName(name: string): { first_name: string; last_name: string | null } {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) {
    return { first_name: "User", last_name: null };
  }
  if (parts.length === 1) {
    return { first_name: parts[0], last_name: null };
  }
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}
