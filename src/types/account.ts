import type { UserPreferences } from "@/types/auth";

export type OrderStatus =
  | "delivered"
  | "shipped"
  | "processing"
  | "cancelled"
  | "refunded";

export type AccountOrder = {
  id: string;
  orderNumber: string;
  productName: string;
  productImage: string;
  status: OrderStatus;
  price: number;
  orderedAt: string;
};

export type AccountAddress = {
  id: string;
  label: "Home" | "Work" | "Other";
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};

export type PaymentMethod = {
  id: string;
  type: "visa" | "mastercard" | "upi";
  label: string;
  masked: string;
  isDefault: boolean;
};

export type AccountStats = {
  orders: number;
  wishlist: number;
  returns: number;
  refunds: number;
};

export type SecurityStatus = {
  email_verified: boolean;
  phone_verified: boolean;
  password_set: boolean;
  two_factor_enabled: boolean;
  active_sessions: number;
  last_login_at: string | null;
  account_created_at: string;
};

export type UserSession = {
  id: string;
  device_name: string;
  browser: string;
  ip_address: string | null;
  last_active_at: string;
  created_at: string;
  is_current: boolean;
};

export type ShoppingPreferences = UserPreferences;

export type ProfileResponse = {
  user: import("@/types/auth").AuthUser;
};

export type OnboardingPayload = {
  name: string;
  phone: string;
  address: Omit<AccountAddress, "id" | "is_default"> & { is_default?: boolean };
  preferences: UserPreferences;
  profile_completed: boolean;
};
