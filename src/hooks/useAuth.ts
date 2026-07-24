"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { useMe } from "@/hooks/useMe";
import { fetchCurrentUser } from "@/lib/user/fetch-current-user";
import { mapCurrentUserToAuthUser } from "@/lib/auth/map-user";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import type { LoginCredentials, SignupCredentials } from "@/types/auth";

/** Same cache as AuthProvider / useMe — no extra /session hit. */
export function useCurrentUser() {
  const { data: me, ...rest } = useMe();
  return {
    ...rest,
    data: me ? mapCurrentUserToAuthUser(me) : null,
  };
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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
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
    mutationFn: () => fetchCurrentUser(),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKeys.me(), data);
    },
  });
}

export { useMe, useOnboarding, useUpdateMe } from "@/hooks/useMe";
export { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from "@/hooks/useAddresses";
export { usePreferences, useUpdatePreferences } from "@/hooks/usePreferences";
export { useAvatarUpload, useAvatarUrl, useDeleteAvatar } from "@/hooks/useAvatar";
export { useSecurityDevices, useLoginHistory, useRevokeDevice, useLogoutAll } from "@/hooks/useSecurity";

export { userService };
