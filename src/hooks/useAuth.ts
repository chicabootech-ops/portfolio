"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import type { LoginCredentials, SignupCredentials } from "@/types/auth";

export function useCurrentUser() {
  return useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: async () => {
      const session = await authService.getSession();
      if (!session || !("user" in session) || !session.user) {
        return null;
      }
      return session.user;
    },
    staleTime: 60_000,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (credentials: SignupCredentials) => authService.register(credentials),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: { email: string; otp: string }) => authService.verifyEmail(payload),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKeys.me(), data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useRefreshSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.getSession(),
    onSuccess: (data) => {
      if (data && "user" in data && data.user) {
        queryClient.setQueryData(userQueryKeys.me(), data.user);
      }
    },
  });
}

// Re-export profile hooks for convenience
export { useMe, useOnboarding, useUpdateMe } from "@/hooks/useMe";
export { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from "@/hooks/useAddresses";
export { usePreferences, useUpdatePreferences } from "@/hooks/usePreferences";
export { useAvatarUpload, useAvatarUrl, useDeleteAvatar } from "@/hooks/useAvatar";
export { useSecurityDevices, useLoginHistory, useRevokeDevice, useLogoutAll } from "@/hooks/useSecurity";

export { userService };
