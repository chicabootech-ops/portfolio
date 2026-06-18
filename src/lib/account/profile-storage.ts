import type { AccountAddress } from "@/types/account";

const AVATAR_PREFIX = "chicaboo_avatar_";
const PHONE_PREFIX = "chicaboo_phone_";
const ADDRESSES_PREFIX = "chicaboo_addresses_";

export function getStoredAvatar(userId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${AVATAR_PREFIX}${userId}`);
}

export function setStoredAvatar(userId: string, dataUrl: string | null) {
  if (typeof window === "undefined") return;
  const key = `${AVATAR_PREFIX}${userId}`;
  if (dataUrl) localStorage.setItem(key, dataUrl);
  else localStorage.removeItem(key);
}

export function getStoredPhone(userId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${PHONE_PREFIX}${userId}`);
}

export function setStoredPhone(userId: string, phone: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PHONE_PREFIX}${userId}`, phone);
}

export function getStoredAddresses(userId: string): AccountAddress[] | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`${ADDRESSES_PREFIX}${userId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AccountAddress[];
  } catch {
    return null;
  }
}

export function setStoredAddresses(userId: string, addresses: AccountAddress[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${ADDRESSES_PREFIX}${userId}`, JSON.stringify(addresses));
}

export async function updateProfileOnServer(body: {
  name?: string;
  phone?: string;
}): Promise<{ ok: boolean; error?: string; user?: unknown }> {
  const response = await fetch("/api/user/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as {
    user?: unknown;
    error?: string;
  };

  if (!response.ok) {
    return {
      ok: false,
      error: data.error ?? "Could not update profile. Try again later.",
    };
  }

  return { ok: true, user: data.user };
}
