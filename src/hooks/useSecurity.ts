"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { userService } from "@/services/user.service";

export function useSecurityDevices(enabled = true) {
  return useQuery({
    queryKey: userQueryKeys.securityDevices(),
    queryFn: async () => {
      const data = await userService.listDevices();
      return data.items;
    },
    staleTime: 5 * 60_000,
    enabled,
  });
}

export function useLoginHistory(
  params?: { limit?: number; offset?: number },
  enabled = true
) {
  return useQuery({
    queryKey: userQueryKeys.securityLogins(params),
    queryFn: () => userService.listLogins(params),
    staleTime: 5 * 60_000,
    enabled,
  });
}

export function useRevokeDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => userService.revokeDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.securityDevices() });
    },
  });
}

export function useLogoutAll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userService.logoutAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.securityDevices() });
    },
  });
}
