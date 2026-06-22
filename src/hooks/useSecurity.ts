"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { userService } from "@/services/user.service";

export function useSecurityDevices() {
  return useQuery({
    queryKey: userQueryKeys.securityDevices(),
    queryFn: async () => {
      const data = await userService.listDevices();
      return data.items;
    },
    staleTime: 30_000,
  });
}

export function useLoginHistory(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: userQueryKeys.securityLogins(params),
    queryFn: () => userService.listLogins(params),
    staleTime: 30_000,
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
