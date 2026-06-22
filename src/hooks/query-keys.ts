/** TanStack Query cache keys for user domain APIs. */

export const userQueryKeys = {
  all: ["user"] as const,
  me: () => [...userQueryKeys.all, "me"] as const,
  onboarding: () => [...userQueryKeys.all, "onboarding"] as const,
  addresses: () => [...userQueryKeys.all, "addresses"] as const,
  address: (id: string) => [...userQueryKeys.addresses(), id] as const,
  preferences: () => [...userQueryKeys.all, "preferences"] as const,
  avatarUrl: () => [...userQueryKeys.all, "avatar", "url"] as const,
  securityDevices: () => [...userQueryKeys.all, "security", "devices"] as const,
  securityLogins: (params?: { limit?: number; offset?: number }) =>
    [...userQueryKeys.all, "security", "logins", params ?? {}] as const,
};
