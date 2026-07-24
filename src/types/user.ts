/** User domain types aligned with UserService API responses. */

export type UserProfile = {
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  referral_code: string | null;
};

export type UserPreferences = {
  id: string;
  email_marketing: boolean;
  sms_marketing: boolean;
  preferred_language: string;
  currency: string;
  push_notifications: boolean;
  analytics_tracking: boolean;
  order_updates_email: boolean;
  order_updates_sms: boolean;
  updated_at: string;
};

export type OnboardingFlags = {
  email_verified: boolean;
  profile_complete: boolean;
  has_address: boolean;
  preferences_reviewed: boolean;
  shopping_ready: boolean;
};

export type CurrentUser = {
  id: string;
  email: string;
  customer_number: number;
  email_verified: boolean;
  phone: string | null;
  phone_verified: boolean;
  status: string;
  last_login_at: string | null;
  created_at: string;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  onboarding: OnboardingFlags | null;
};

export type ProfileUpdatePayload = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  referral_code?: string;
};

export type OnboardingStep = {
  key: string;
  label: string;
  completed: boolean;
  required: boolean;
};

export type OnboardingStatus = {
  email_verified: boolean;
  profile_complete: boolean;
  has_address: boolean;
  preferences_reviewed: boolean;
  shopping_ready: boolean;
  profile_completed_at: string | null;
  address_added_at: string | null;
  preferences_reviewed_at: string | null;
  shopping_ready_at: string | null;
  steps: OnboardingStep[];
  completion_percent: number;
};

export type UserAddress = {
  id: string;
  label: string | null;
  full_name: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  address_type: string;
  custom_label: string | null;
  created_at: string;
  updated_at: string;
};

export type AddressListResponse = {
  items: UserAddress[];
  total: number;
};

export type AddressCreatePayload = {
  label?: string | null;
  full_name: string;
  phone?: string | null;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  address_type?: string;
  custom_label?: string | null;
  is_default?: boolean;
};

export type AddressUpdatePayload = Partial<AddressCreatePayload>;

export type PreferencesUpdatePayload = {
  email_marketing?: boolean;
  sms_marketing?: boolean;
  preferred_language?: string;
  currency?: string;
  push_notifications?: boolean;
  analytics_tracking?: boolean;
  order_updates_email?: boolean;
  order_updates_sms?: boolean;
};

export type SecurityDevice = {
  id: string;
  device_name: string | null;
  device_type: string;
  ip_address: string | null;
  user_agent: string | null;
  last_seen_at: string;
  created_at: string;
  is_current: boolean;
};

export type SecurityDeviceList = {
  items: SecurityDevice[];
  total: number;
};

export type LoginHistoryEntry = {
  id: string;
  success: boolean;
  failure_reason: string | null;
  ip_address: string | null;
  user_agent: string | null;
  device_id: string | null;
  created_at: string;
};

export type LoginHistoryList = {
  items: LoginHistoryEntry[];
  total: number;
};

export type AvatarUploadUrlRequest = {
  content_type: string;
  content_length: number;
};

export type AvatarUploadUrlResponse = {
  upload_url: string;
  key: string;
  expires_at: string;
  max_size_bytes: number;
};

export type AvatarUrlResponse = {
  url: string;
  key: string | null;
  expires_at: string;
};

export type ApiErrorBody = {
  error?: string;
  message?: string;
  code?: string;
  detail?: string | { msg: string }[];
};

export class UserApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "UserApiError";
  }
}
