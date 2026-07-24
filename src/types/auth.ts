export type UserPreferences = {
  theme: "light" | "dark" | "system";
  language: string;
  currency: string;
  marketing_emails: boolean;
  order_notifications: boolean;
  wishlist_alerts: boolean;
  price_alerts: boolean;
  back_in_stock_alerts: boolean;
};

export type AuthSessionResponse = {
  user: AuthUser;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  is_verified: boolean;
  phone_verified: boolean;
  profile_completed: boolean;
  avatar_url: string | null;
  preferences: UserPreferences;
  created_at: string;
  updated_at?: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  email: string;
  password: string;
  name: string;
};
