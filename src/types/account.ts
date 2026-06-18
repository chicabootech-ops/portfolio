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
  isDefault: boolean;
};

export type PaymentMethod = {
  id: string;
  type: "visa" | "mastercard" | "upi";
  label: string;
  masked: string;
  isDefault: boolean;
};

export type AccountProfile = {
  phone: string;
  phoneVerified: boolean;
  loyaltyLevel: "Gold" | "Silver" | "Bronze" | null;
  isPremium: boolean;
};

export type AccountStats = {
  orders: number;
  wishlist: number;
  returns: number;
  refunds: number;
};

export type SecurityStatus = {
  emailVerified: boolean;
  phoneVerified: boolean;
  passwordSet: boolean;
  twoFactorEnabled: boolean;
  activeSessions: number;
};

export type ShoppingPreferences = {
  theme: "light" | "dark" | "system";
  language: string;
  currency: string;
  marketingEmails: boolean;
  orderUpdates: boolean;
  wishlistAlerts: boolean;
  priceDropAlerts: boolean;
  backInStockAlerts: boolean;
};
