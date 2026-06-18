import type {
  AccountAddress,
  AccountOrder,
  AccountProfile,
  AccountStats,
  PaymentMethod,
  SecurityStatus,
  ShoppingPreferences,
} from "@/types/account";

export const accountStats: AccountStats = {
  orders: 12,
  wishlist: 8,
  returns: 1,
  refunds: 2,
};

export const accountProfile: AccountProfile = {
  phone: "+91 98765 43210",
  phoneVerified: true,
  loyaltyLevel: "Gold",
  isPremium: true,
};

export const recentOrders: AccountOrder[] = [
  {
    id: "ord-1",
    orderNumber: "CHB-2026-10482",
    productName: "Ruby Rose Bouquet",
    productImage: "/collections/premium-blooms.jpg",
    status: "delivered",
    price: 89,
    orderedAt: "2026-06-12T10:30:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "CHB-2026-10391",
    productName: "Eternal Love Combo",
    productImage: "/collections/combos.jpg",
    status: "shipped",
    price: 120,
    orderedAt: "2026-06-15T14:20:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "CHB-2026-10344",
    productName: "Blush Peony Delight",
    productImage: "/collections/birthday-blooms.jpg",
    status: "processing",
    price: 75,
    orderedAt: "2026-06-17T09:15:00Z",
  },
];

export const accountAddresses: AccountAddress[] = [
  {
    id: "addr-1",
    label: "Home",
    name: "Shresth Jindal",
    phone: "+91 98765 43210",
    line1: "42 Rosewood Lane, Sector 18",
    line2: "Near City Mall",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122001",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Work",
    name: "Shresth Jindal",
    phone: "+91 98765 43210",
    line1: "WeWork, DLF Cyber City",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122002",
    isDefault: false,
  },
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: "pay-1",
    type: "visa",
    label: "Visa",
    masked: "•••• 4242",
    isDefault: true,
  },
  {
    id: "pay-2",
    type: "upi",
    label: "UPI",
    masked: "shresth@upi",
    isDefault: false,
  },
];

export const securityStatus: SecurityStatus = {
  emailVerified: true,
  phoneVerified: true,
  passwordSet: true,
  twoFactorEnabled: false,
  activeSessions: 2,
};

export const defaultPreferences: ShoppingPreferences = {
  theme: "light",
  language: "English",
  currency: "USD",
  marketingEmails: true,
  orderUpdates: true,
  wishlistAlerts: true,
  priceDropAlerts: false,
  backInStockAlerts: true,
};
