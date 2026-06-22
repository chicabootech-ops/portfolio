/**
 * User domain API client — calls Next.js BFF routes (`/api/user/*`).
 * BFF proxies to Gateway → UserService.
 */

import { apiFetch, apiUploadToUrl } from "@/lib/api/http";
import type {
  AddressCreatePayload,
  AddressListResponse,
  AddressUpdatePayload,
  AvatarUploadUrlRequest,
  AvatarUploadUrlResponse,
  AvatarUrlResponse,
  CurrentUser,
  LoginHistoryList,
  OnboardingStatus,
  PreferencesUpdatePayload,
  ProfileUpdatePayload,
  SecurityDeviceList,
  UserAddress,
  UserPreferences,
} from "@/types/user";

const BASE = "/api/user";

export const userService = {
  // Profile
  getMe: () => apiFetch<CurrentUser>(`${BASE}/me`),
  updateMe: (payload: ProfileUpdatePayload) =>
    apiFetch<CurrentUser>(`${BASE}/me`, { method: "PATCH", body: payload }),
  getOnboarding: () => apiFetch<OnboardingStatus>(`${BASE}/me/onboarding`),

  // Addresses
  listAddresses: () => apiFetch<AddressListResponse>(`${BASE}/me/addresses`),
  createAddress: (payload: AddressCreatePayload) =>
    apiFetch<UserAddress>(`${BASE}/me/addresses`, { method: "POST", body: payload }),
  getAddress: (id: string) => apiFetch<UserAddress>(`${BASE}/me/addresses/${id}`),
  updateAddress: (id: string, payload: AddressUpdatePayload) =>
    apiFetch<UserAddress>(`${BASE}/me/addresses/${id}`, { method: "PATCH", body: payload }),
  deleteAddress: (id: string) =>
    apiFetch<{ message: string }>(`${BASE}/me/addresses/${id}`, { method: "DELETE" }),
  setDefaultAddress: (id: string) =>
    apiFetch<UserAddress>(`${BASE}/me/addresses/${id}/default`, { method: "POST" }),

  // Preferences
  getPreferences: () => apiFetch<UserPreferences>(`${BASE}/me/preferences`),
  updatePreferences: (payload: PreferencesUpdatePayload) =>
    apiFetch<UserPreferences>(`${BASE}/me/preferences`, { method: "PATCH", body: payload }),

  // Security
  listDevices: () => apiFetch<SecurityDeviceList>(`${BASE}/me/security/devices`),
  listLogins: (params?: { limit?: number; offset?: number }) => {
    const search = new URLSearchParams();
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.offset) search.set("offset", String(params.offset));
    const qs = search.toString();
    return apiFetch<LoginHistoryList>(
      `${BASE}/me/security/logins${qs ? `?${qs}` : ""}`
    );
  },
  revokeDevice: (id: string) =>
    apiFetch<{ message: string }>(`${BASE}/me/security/devices/${id}/revoke`, {
      method: "POST",
    }),
  logoutAll: () =>
    apiFetch<{ message: string }>(`${BASE}/me/security/logout-all`, { method: "POST" }),

  // Avatar (R2 presigned flow)
  getAvatarUploadUrl: (payload: AvatarUploadUrlRequest) =>
    apiFetch<AvatarUploadUrlResponse>(`${BASE}/me/avatar/upload-url`, {
      method: "POST",
      body: payload,
    }),
  confirmAvatar: (contentLength: number) =>
    apiFetch<{ key: string; message: string }>(`${BASE}/me/avatar/confirm`, {
      method: "POST",
      body: { content_length: contentLength },
    }),
  getAvatarUrl: () => apiFetch<AvatarUrlResponse>(`${BASE}/me/avatar/url`),
  deleteAvatar: () =>
    apiFetch<{ message: string }>(`${BASE}/me/avatar`, { method: "DELETE" }),

  /** Upload file bytes directly to R2 presigned URL. */
  uploadAvatarToR2: (
    uploadUrl: string,
    file: Blob,
    contentType: string,
    onProgress?: (percent: number) => void
  ) => apiUploadToUrl(uploadUrl, file, contentType, onProgress),
};

export type UserService = typeof userService;
