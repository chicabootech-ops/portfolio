import type {
  AccountAddress,
  OnboardingPayload,
  ProfileResponse,
  SecurityStatus,
  UserSession,
} from "@/types/account";
import type { AuthUser, UserPreferences } from "@/types/auth";

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data;
}

export async function fetchProfile(): Promise<AuthUser> {
  const response = await fetch("/api/user/profile", { credentials: "same-origin", cache: "no-store" });
  const data = await parseJson<ProfileResponse>(response);
  return data.user;
}

export async function updateProfile(payload: {
  name?: string;
  phone?: string;
  preferences?: Partial<UserPreferences>;
  profile_completed?: boolean;
}): Promise<AuthUser> {
  const response = await fetch("/api/user/profile", {
    method: "PATCH",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJson<ProfileResponse>(response);
  return data.user;
}

export async function completeOnboarding(payload: OnboardingPayload): Promise<AuthUser> {
  const response = await fetch("/api/user/onboarding", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      address: { ...payload.address, is_default: true },
    }),
  });
  const data = await parseJson<ProfileResponse>(response);
  return data.user;
}

export async function fetchAddresses(): Promise<AccountAddress[]> {
  const response = await fetch("/api/user/addresses", { credentials: "same-origin", cache: "no-store" });
  return parseJson<AccountAddress[]>(response);
}

export async function createAddress(address: Omit<AccountAddress, "id">): Promise<AccountAddress> {
  const response = await fetch("/api/user/addresses", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
  return parseJson<AccountAddress>(response);
}

export async function updateAddress(
  id: string,
  address: Partial<AccountAddress>
): Promise<AccountAddress> {
  const response = await fetch(`/api/user/addresses/${id}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
  return parseJson<AccountAddress>(response);
}

export async function deleteAddress(id: string): Promise<void> {
  const response = await fetch(`/api/user/addresses/${id}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? "Could not delete address");
  }
}

export async function fetchSecurity(): Promise<SecurityStatus> {
  const response = await fetch("/api/user/security", { credentials: "same-origin", cache: "no-store" });
  return parseJson<SecurityStatus>(response);
}

export async function fetchSessions(): Promise<UserSession[]> {
  const response = await fetch("/api/user/sessions", { credentials: "same-origin", cache: "no-store" });
  return parseJson<UserSession[]>(response);
}

export async function revokeOtherSessions(): Promise<void> {
  const response = await fetch("/api/user/sessions/revoke-others", {
    method: "POST",
    credentials: "same-origin",
  });
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? "Could not revoke sessions");
  }
}

export async function revokeAllSessions(): Promise<void> {
  const response = await fetch("/api/user/sessions/revoke-all", {
    method: "POST",
    credentials: "same-origin",
  });
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? "Could not revoke sessions");
  }
}

export async function uploadAvatar(file: File): Promise<AuthUser> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/user/avatar", {
    method: "POST",
    credentials: "same-origin",
    body: formData,
  });
  const data = await parseJson<ProfileResponse>(response);
  return data.user;
}

export async function deleteAvatar(): Promise<AuthUser> {
  const response = await fetch("/api/user/avatar", {
    method: "DELETE",
    credentials: "same-origin",
  });
  const data = await parseJson<ProfileResponse>(response);
  return data.user;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const response = await fetch("/api/user/security/password", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? "Could not change password");
  }
}

export async function deleteAccount(password: string): Promise<void> {
  const response = await fetch("/api/user/account/delete", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, confirmation: "DELETE" }),
  });
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? "Could not delete account");
  }
}
